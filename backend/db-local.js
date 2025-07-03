const mongoose = require('mongoose');

// Local MongoDB connection (requires MongoDB to be installed locally)
const LOCAL_MONGO_URI = 'mongodb://localhost:27017/social_dashboard';

// Atlas MongoDB connection
const ATLAS_MONGO_URI = 'mongodb+srv://bavdhanekunal19:Kunal1234@cluster0.ubecr2g.mongodb.net/social_dashboard?retryWrites=true&w=majority&appName=Cluster0';

// Try Atlas first, fallback to local
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(ATLAS_MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (atlasError) {
    console.log('❌ Atlas connection failed, trying local MongoDB...');
    try {
      await mongoose.connect(LOCAL_MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ Connected to local MongoDB');
    } catch (localError) {
      console.error('❌ Both Atlas and local MongoDB connections failed:');
      console.error('Atlas error:', atlasError.message);
      console.error('Local error:', localError.message);
      console.log('\n🔧 SOLUTIONS:');
      console.log('1. For Atlas: Whitelist your IP at https://cloud.mongodb.com/');
      console.log('2. For Local: Install MongoDB locally or use MongoDB Community Server');
      process.exit(1);
    }
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