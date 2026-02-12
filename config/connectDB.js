// required for connecting to MongoDB using Mongoose

const mongoose = require('mongoose');

// create DB
const connectDB = async () => {
try { 
  await mongoose.connect(process.env.DB_URI);
  console.log(" Database connecter ...");
}catch (error) {
  console.log("Error connecting to database !!", error);
}
};

module.exports = connectDB;