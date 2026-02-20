// 1- require express
const express = require('express');

// 2- create an express app
const app = express();

// require dotenv
require('dotenv').config();

//  connectDB
const connectDB = require('./config/connectDB');
connectDB();


//Routing 
//middleware global 

app.use(express.json());

//middleware routes
app.use('/api/upload', require('./routes/upload'));

app.use('/api/user', require('./routes/user'));
app.use('/api/destination', require('./routes/destination'));
app.use('/api/voyage', require('./routes/voyage'));

// 3- create PORT
const PORT = process.env.PORT;

// 4 - create server 
app.listen(PORT, (err) =>
    err ? console.log(err) : console.log(`Server is running on port ${PORT} .. `)
); 