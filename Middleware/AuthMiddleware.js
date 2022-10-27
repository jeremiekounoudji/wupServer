const jwt = require("jsonwebtoken")






module.exports = function (req, res, next) {
    //check if token exist
    const token = req.header("auth-token");
    if (!token) {
        res.send('acces denied')
    };

    //verify the token
    try {
        console.log("VERRIFICATION...");
        const verifidToken = jwt.verify(token,"jifkkkdlldllld");
        console.log("VERRIFICATION IN PRCESS...");

        req.user = verifidToken;
        console.log("VERRIFICATION FINISHED...");
        
        next();
    } catch (error) {
        res.status(400).json({message:error})
    }
}