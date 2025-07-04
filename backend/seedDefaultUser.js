const mongoose = require('./db');
const User = require('./models/User');

async function seed() {
  const username = 'demo';
  const password = 'demo123';

  let user = await User.findOne({ username });
  if (!user) {
    user = new User({ username, password: password });
    await user.save();
    console.log('Default user created: demo');
  } else {
    console.log('Default user already exists: demo');
  }
  mongoose.connection.close();
}

seed(); 