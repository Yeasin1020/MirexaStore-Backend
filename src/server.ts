import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http'
import './app/cron/sellerValidityJob';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();


process.on('unhandledRejection', () => {
  console.log(`😪 unhandledRejection is detected, shutting down ....`);
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})