import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Sadece bağlantı çağrıldığında kontrol edeceğiz ki build esnasında patlamasın.

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Veritabanına ulaşılamazsa istekler ~30 sn asılı kalmasın, hızlıca hata dönsün.
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Başarısız bağlantı önbellekte kalırsa sonraki tüm istekler de başarısız olur.
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

export default connectToDatabase;
