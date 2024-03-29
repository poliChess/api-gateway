import 'isomorphic-unfetch';
import { ApolloServer } from 'apollo-server';

import discovery from './grpc/discovery';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolver';

import jwt from './jwt';

function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const identity = jwt.verify(req.headers.authorization || '');
      return { identity }
    }
  });

  server.listen(3000).then(() => {
    console.log("api gateway started");
  });

  discovery.register('api-gateway', 'api-gateway:3000');
}

main()
