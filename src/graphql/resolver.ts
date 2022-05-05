import { getMatches } from './services/matchService';
import { getUser, findUser, addUser, authenticate } from './services/userService';
import { statusGood, authThen, statusBad } from './utils';
import jwt from '../jwt';

import { Root } from './utils';

const resolvers: Root = {
  Query: {
    running: () => statusGood,

    me: authThen(({}, {}, context) => getUser(context.identity.id)),
    user: authThen(({}, args) => findUser(args.username)),

    matches: authThen(() => getMatches()),

    bestMove: () => {},
    validateMove: () => {},
  },

  Mutation: {
    register: ({}, args) => addUser(args),
    login: async ({}, args) => {
      const res = await authenticate(args);

      if (!res.success) return res;

      res.token = jwt.create({ id: res.user.id });
      return res
    },

    updateUser: authThen(() => statusBad('not implemented')),
    deleteUser: authThen(() => statusBad('not implemented')),

    enterQueue: authThen(() => statusBad('not implemented')),
    leaveQueue: authThen(() => statusBad('not implemented')),
  },

  User: {
    history: () => [],
    currentGame: () => null,
  },

  Match: {
    player1: () => {},
    player2: () => null,
  }
}

export default resolvers;
