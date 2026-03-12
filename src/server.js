const app = require('./app');
const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google's DNS for SRV resolution fixes
dns.setServers(['8.8.8.8', '8.8.4.4']);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ideal_backend';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    // Increase server timeout to 10 minutes for large video uploads
    server.timeout = 600000;
  })
  .catch((error) => {
    console.error('MongoDB connection error details (full stack):');
    console.error(error.stack || error.message || error);
    process.exit(1);
  });
