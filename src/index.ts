import { ApolloServer } from 'apollo-server';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolver';

function main() {
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    context: ({req}) => {
      const token = req.headers.authorization || '';
      return { token }
    }
  });

  server.listen(3000).then(() => {
    console.log("api gateway started");
  });
}

main()
