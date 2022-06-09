const dotenv = require('dotenv'); 
dotenv.config(); 
module.exports = {
    port:process.env.PORT || 8000 ,
    mongoose:{
        url:process.env.MONGO_URL,
        options:{
            // useCreateIndex:true,
            useNewUrlParser:true 
        }
    },
    jwt:{
        jwtsecret : process.env.JWT_SECRET,
    },
    email:{
        id: process.env.NODE_MAILER_EMAIL,
        password:process.env.NODE_MAILER_PASSWORD,
        app_password:process.env.APP_PASSWORD 
    },
    oauth:{
        client_id:process.env.CLIENT_ID,
        client_secret:process.env.CLIENT_SECRET,
    //     client_redirect:process.env.REDIRECT_URI,
    //     client_refresh_token:process.env.REFRESH_TOKEN
    }
}