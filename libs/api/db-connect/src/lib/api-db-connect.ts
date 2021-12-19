import mongoose, { Connection } from 'mongoose';

export default function connect(uri: string): Connection {
  mongoose.connect(uri, {
    connectTimeoutMS: 1000,
  });

  //Get the default connection
  const db = mongoose.connection;

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  return db;
}
