import sqlite3 from 'sqlite3';
import {DB_PATH} from './config';
import {promisify} from 'bluebird';

async function openConnection(request, reply) {
  try {
    request.db = new sqlite3.Database(DB_PATH);
    request.db.get = promisify(request.db.get);
    request.db.all = promisify(request.db.all);

    reply.continue();
  } catch (error) {
    reply(error);
  }
}

async function closeConnection(request) {
  if (request.db) {
    await request.db.close();
  }
}

function register(server, options, next) {
  server.ext('onRequest', openConnection);
  server.on('tail', closeConnection);
  next();
}

register.attributes = {
  name: 'SqlitePlugin'
};

const SqlitePlugin = {register};
export default SqlitePlugin;
