const mongoose = require('mongoose'); 
const app = require('./app'); 
const config = require('./config/config');

mongoose
.connect(config.mongoose.url , config.mongoose.options)
.then(()=>{
    console.log('Db Connected');
    app.listen(config.port,()=>{
        console.log('Server Started'); 
    }) 
})
.catch((err)=>{
    console.log(err.message); 
})
