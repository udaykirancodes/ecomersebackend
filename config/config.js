const dotenv = require('dotenv'); 
dotenv.config(); 
module.exports = {
    port:process.env.PORT,
    mongoose:{
        url:process.env.MONGO_URL,
        options:{
            // useCreateIndex:true,
            useNewUrlParser:true 
        }
    },
    jwt:{
        jwtsecret : process.env.JWT_SECRET,
    }
}