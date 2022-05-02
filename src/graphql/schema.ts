import { readFileSync } from 'fs';

const typeDefs = readFileSync('./src/graphql/schema.graphql').toString()

export default typeDefs;
