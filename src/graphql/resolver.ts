import { getMatches } from './services/matchService';
import { getUser, findUser, addUser, authenticate } from './services/userService';
import { statusGood, authThen } from './utils';
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

    updateUser: authThen(() => {}),
    deleteUser: authThen(() => {}),

    enterQueue: authThen(() => {}),
    leaveQueue: authThen(() => {}),
  },

  User: {
    history: () => {},
    currentGame: () => {},
  },

  Match: {
    player1: () => {},
    player2: () => {},
  }
}

export default resolvers;
