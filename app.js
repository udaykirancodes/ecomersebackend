const express = require('express'); 

const app = express(); 

//middlewares 
app.use(express.json());  

const routes = require('./routes/index'); 

app.use('/',routes)

module.exports = app;  