const express = require('express'); 

const app = express(); 

const cors = require('cors'); 
//middlewares 
app.use(express.json());  

app.use(cors()); 


const routes = require('./routes/index'); 

app.use('/',routes)




// to serve the static files 
app.use('/uploads',express.static('uploads/'));


module.exports = app;  