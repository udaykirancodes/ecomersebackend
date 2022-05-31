const jwt = require('jsonwebtoken');
const config = require('../config/config');
const JWT_SECRET = config.jwt.jwtsecret;
const FetchAdmin = (req,res,next)=>{
    // GET USER FROM JWT TOKEN 
    let success = false 
    const token = req.header('adminToken');
    if(!token){
        return res.status(401).send({success , msg:"Invalid Token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.admin = data.admin 
        next()
    } catch (error) {
        res.status(401).send({success,msg:"Internal Server Error"})
    }
}
module.exports = FetchAdmin 