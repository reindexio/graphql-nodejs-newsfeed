import Hapi from 'hapi';
import {graphql} from 'graphql';
import {promisify} from 'bluebird';
import {HOST, PORT} from './config';
import SqlitePlugin from './SqlitePlugin';
import Schema from './Schema';

async function graphQLHandler(request, reply) {
  const {query, variables = {}} = request.payload;
  const result = await graphql(
    Schema,
    query,
    {
      db: request.db,
      userId: '1'
    },
    variables
  );
  return reply(result);
}

export default async function runServer() {
  try {
    const server = new Hapi.Server();

    // Make server methods promise friendly
    for (const method of ['register', 'start']) {
      server[method] = promisify(server[method], server);
    }

    server.connection({
      host: HOST,
      port: PORT
    });

    await server.register(SqlitePlugin);

    server.route({
      method: 'POST',
      path: '/',
      handler: graphQLHandler
    });

    await server.start();

    console.log('Server started at ' + server.info.uri);
  } catch(e) {
    console.log(e);
  }
}
