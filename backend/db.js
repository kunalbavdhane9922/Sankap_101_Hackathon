const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://bavdhanekunal19:Kunal1234@cluster0.ubecr2g.mongodb.net/social_dashboard?retryWrites=true&w=majority&appName=Cluster0';

// Modern connection approach for Node.js 22+
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Backend will run without database functionality');
    console.log('💡 To fix: Whitelist your IP in MongoDB Atlas');
    // Don't exit the process - let the backend continue running
  }
};

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connection established');
});

// Connect immediately
connectDB();

module.exports = mongoose; 