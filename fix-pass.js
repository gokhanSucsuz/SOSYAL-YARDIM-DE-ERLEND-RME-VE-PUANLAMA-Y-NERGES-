const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixPassword() {
  await mongoose.connect('mongodb+srv://socialadmin:E8qVd9yO0b@cluster0.o7xzy.mongodb.net/sosyal-yardim-db?retryWrites=true&w=majority');
  const db = mongoose.connection.db;
  
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('784512Gg.', salt);
  
  const result = await db.collection('users').updateOne(
    { email: 'gokhansucsuz@gmail.com' },
    { $set: { passwordHash: hash, forcePasswordReset: false, failedLoginAttempts: 0, lockUntil: null } }
  );
  
  console.log('Update result:', result);
  process.exit(0);
}
fixPassword();
