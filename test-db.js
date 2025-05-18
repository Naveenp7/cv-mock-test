const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }); 