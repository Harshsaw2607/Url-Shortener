import axios from "axios"
const URL = process.env.VITE_BACKEND_URL

const uploadDataRegister = async (Data) => {
    try {
        const response = await axios.post(`${URL}/api/auth/register`, Data, { withCredentials: true })
        return response
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const newResponse = {
                data: error.response.data,
                success: false
            }
            return newResponse; // You can return this to handle the error in the calling function
        } else {
            console.log("Error while Uploading Data ", error);
        }
    }
}

const uploadDataLogIn = async (Data) => {
    try {
        const response = await axios.post(`${URL}/api/auth/login`, Data, { withCredentials: true })
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const newResponse = {
                data: {
                    message: error.response.data,
                    success: false
                }
            }
            return newResponse; // You can return this to handle the error in the calling function
        } else {
            console.log("Error while Uploading Data ", error);
        }
    }
}



const handleShortenUrl = async (originalUrl) => {
    try {
        console.log("originalUrl = ", originalUrl);
        const response = await axios.post(`${URL}/api/HandleURL/url/create`, { longUrl:originalUrl.originalUrl, alias: originalUrl.alias });

        if (response.status === 200) {
            const data = response.data;
            const newResponse = {
                data: data,
                success: true,
                status: response.status
                
            }
            return newResponse
        } 
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const newResponse = {
                message: error.response.data,
                success: false

            }
            console.log("Error got = ",error.response.data);
            return { error: error.response.data || 'An error occurred while shortening the URL' }
        } else {
            console.log("Error while shortening URL ", error);
        }
    }
};

const handleRedirectToOriginalUrl = async (shortenedUrl) => {
    try {
        const shortId = shortenedUrl.split("/").pop();
        const response = await axios.get(`${URL}/api/HandleURL/url/${shortId}`,{ withCredentials: true });
        console.log("responseReceived = ", response);
        if (response.status === 200) {
            console.log("Response url = ",response.data.RedirectURL);
            window.open(response.data.RedirectURL, "_blank");
        }
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data || 'An error occurred while redirecting to the original URL' }
        } else {
            console.log("Error while redirecting to the original URL ", error);
        }
    }
}

const handleQr = async (longUrl) => {
    try {
        const response = await axios.post(`${URL}/api/HandleURL/url/generate`, { longUrl: longUrl });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        
        if (axios.isAxiosError(error) && error.response) {
            console.log("Error while generating the QR code ", error.response.data);
            return { error: error.response.data || 'An error occurred while generating the QR code' }
        } else {
            console.log("Error while generating the QR code ", error);
        }
    }
}

export { handleShortenUrl, handleRedirectToOriginalUrl, handleQr, uploadDataRegister, uploadDataLogIn }