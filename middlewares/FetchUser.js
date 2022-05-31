const jwt = require('jsonwebtoken');
const config = require('../config/config');
const JWT_SECRET = config.jwt.jwtsecret;
const FetchUser = (req,res,next)=>{
    // GET USER FROM JWT TOKEN 
    try {
        let success = false 
        const token = req.header('authToken');
        if(!token){
            return res.status(401).send({success , msg:"Invalid Token"})
        }
        const data = jwt.verify(token,JWT_SECRET);
        req.user= data.user 
        next()
    } catch (error) {
        res.status(401).send({success:false,msg:"Internal Server Error"})
    }
}
module.exports = FetchUser 