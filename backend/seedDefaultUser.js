const mongoose = require('./db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  const username = 'demo';
  const email = 'demo@example.com';
  const password = 'demo123';
  const hash = await bcrypt.hash(password, 10);

  let user = await User.findOne({ username });
  if (!user) {
    user = new User({ username, email, password: hash });
    await user.save();
    console.log('Default user created: demo');
  } else {
    console.log('Default user already exists: demo');
  }
  mongoose.connection.close();
}

seed(); 