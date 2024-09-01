import Url from '../models/Url.js';

const RedirectTo = async (req, res) => {
    const shortId=req.params.shortId;
    
    try {
        const entry = await Url.findOneAndUpdate(
            { shortID: shortId },  // Correct filter key
            { $push: { visitHistory: Date.now() } },  // Correct update syntax
        );
    
        if(entry){
            return res.status(200).json({
                RedirectURL : entry.longUrl,
                success: true,
                status: 200
            });
        }
        else{
            console.log("shortId does not exist");
            return res.status(400).json({
                message : 'Invalid URL',
                from:'URL',
                success: false,
                status: 400
            });
        }
    } catch (error) {
        console.log("Error in Redirecting", error);
        return res.status(500).json({
            message : 'Internal Server Error',
            from:'Server',
            success: false,
            error:error,
            status: 500
        });
    }
    

}

export { RedirectTo }