// rateLimiter.js
import redisClient from "./RedisClient.js";

const TOKEN_BUCKET_CAPACITY = 80; // Example capacity
const WINDOW_SIZE_S = 60; // 1 minute
const REFILL_RATE_S = 1; // Tokens added every 1 seconds
const TOKENS_PER_REFILL = 1; // Add 1 token per refill interval
const MAX_REQUESTS = 100; // Example limit
const BIN_SIZE_S = 10; // 10 seconds

// Utility function to get the current timestamp
const currentTimestamp = () => Math.floor(Date.now()/1000);

const getBinKey = (timestamp) => {
    return Math.floor(timestamp / BIN_SIZE_S);
};


export const rateLimiter = async (req, res, next) => {
    const userId = req.ip; // You might want to use a different identifier for users
    const now = currentTimestamp();

    // Token Bucket logic
    const bucketKey = `bucket:${userId}`;
    const bucket = await redisClient.hgetall(bucketKey);

    if (Object.keys(bucket).length) {
        const tokens = parseInt(bucket.tokens, 10);
        const lastRefill = parseInt(bucket.lastRefill, 10);

        // Calculate how many tokens should be refilled
        const elapsedTime = now - lastRefill;
        const tokensToAdd = Math.floor(elapsedTime / REFILL_RATE_S) * TOKENS_PER_REFILL;
        const newTokens = Math.min(TOKEN_BUCKET_CAPACITY, tokens + tokensToAdd);

        if (newTokens > 0) {
            // Deduct a token for the current request
            const updatedTokens = newTokens - 1;
            await redisClient.hset(bucketKey, { tokens: updatedTokens, lastRefill: now });
        } else {
            return res.status(429).json({ 
                message: 'Rate limit exceeded Per User',
                status: 429
            });
        }
    } else {
        // This is a new user or the first request in a long time
        await redisClient.hset(bucketKey, { tokens: TOKEN_BUCKET_CAPACITY - 1, lastRefill: now });
    }


    // Sliding Window Counter logic
    const binKey = getBinKey(now);

    // Increment the count for the current bin
    await redisClient.hincrby(`requests:${binKey}`, 'count', 1);

    // Remove bins that are outside the sliding window
    const minBinKey = getBinKey(now - WINDOW_SIZE_S);
    const allBinKeys = await redisClient.keys('requests:*');

    const binsToRemove = allBinKeys.filter(key => parseInt(key.split(':')[1], 10) < minBinKey);
    
    if (binsToRemove.length > 0) {
        await redisClient.del(binsToRemove.map(key => `requests:${key}`));
    }

    // Calculate total requests in the current time window
    const newAllBinKeys = allBinKeys.filter(key => !binsToRemove.includes(key));

    // Calculate total requests in the current time window
    let totalRequests = 0;
    for (let i = 0; i < newAllBinKeys.length; i++) {
        const binData = await redisClient.hgetall(newAllBinKeys[i]);
        totalRequests += parseInt(binData.count, 10) || 0;
    }
    
    if (totalRequests > MAX_REQUESTS) {
        return res.status(429).json({ 
            message: 'Rate limit exceeded Overall',
            status: 429
         });
    }

    // Proceed with the request
    next();
};
