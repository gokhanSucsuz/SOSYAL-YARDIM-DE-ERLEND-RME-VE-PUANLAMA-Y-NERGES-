const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://socialadmin:E8qVd9yO0b@cluster0.o7xzy.mongodb.net/sosyal-yardim-db?retryWrites=true&w=majority');
  const db = mongoose.connection.db;
  const result = await db.collection('users').updateOne(
    { email: 'gokhansucsuz@gmail.com' },
    { $unset: { passwordHash: "" }, $set: { forcePasswordReset: true } }
  );
  console.log('Update result:', result);
  process.exit(0);
}
run();
