import Url from '../models/Url.js';

const Analytics = async (req,res) =>{
    const {shortId}=req.params;
    try {
        const present = await Url.findOne({shortID: shortId});
        if(present){
            return res.status(200).json({
                message : 'URL Found',
                success: true,
                data : present.visitHistory.length
            });
        }
        else{
            console.log("shortId does not exist");
            return res.status(400).json({
                message : 'URL Not Found',
                success: false
            });
        }
    } catch (error) {
        console.log("Error in Fetching Analytics", error);
        return res.status(500).json({
            message : 'Internal Server Error',
            success: false,
            error:error
        });
    }
    
}

export { Analytics }