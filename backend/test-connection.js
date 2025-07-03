const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://bavdhanekunal19:Kunal1234@cluster0.ubecr2g.mongodb.net/social_dashboard?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing MongoDB connection...');
console.log('Connection string:', MONGO_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

const testConnection = async () => {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('whitelist')) {
      console.log('\n🔧 SOLUTION: You need to whitelist your IP address in MongoDB Atlas:');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Select your project and cluster');
      console.log('3. Go to Network Access > IP Access List');
      console.log('4. Click "Add IP Address"');
      console.log('5. Add your current IP or use 0.0.0.0/0 for all IPs (development only)');
    }
    
    process.exit(1);
  }
};

testConnection(); 