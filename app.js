const express = require('express'); 

const app = express(); 

//middlewares 
app.use(express.json());  

const routes = require('./routes/index'); 

app.use('/',routes)




// to serve the static files 
app.use('/uploads',express.static('uploads/'));


module.exports = app;  