import jwt from '../jwt';

import { getMatches, getHistory, leaveQueue, enterQueue } from './services/matchService';
import { authenticate, getUser, findUser, addUser, updateUser, deleteUser } from './services/userService';
import { suggetMove, validateMove } from './services/gameEngineService';

import { statusGood, authThen, statusBad } from './utils';
import { Root } from './utils';

const resolvers: Root = {
  Query: {
    running: () => statusGood,

    me: authThen(({}, {}, context) => getUser(context.identity.id)),
    user: authThen(({}, args) => findUser(args.username)),

    matches: authThen(() => getMatches()),

    suggestMove: ({}, args) => suggetMove(args.fen),
    validateMove: ({}, args) => validateMove(args.fen, args.move),
  },

  Mutation: {
    register: ({}, args) => addUser(args),
    login: async ({}, args) => {
      const res = await authenticate(args);
      if (!res.success) return res;

      res.token = jwt.create({ id: res.user.id });
      return res
    },

    updateUser: authThen(({}, args, context) => updateUser({ id: context.identity.id, ...args })),
    deleteUser: authThen(({}, {}, context) => deleteUser(context.identity.id)),

    enterQueue: authThen(async ({}, {}, context) => { 
      const user = await getUser(context.identity.id);
      return enterQueue({ playerID: user.id, playerRating: user.rating });
    }),
    leaveQueue: authThen(({}, {}, context) => leaveQueue({ playerID: context.identity.id })),
  },

  User: {
    history: (parent, args) => getHistory({ playerID: parent.id, ...args }),
    currentGame: () => null,
  },

  Match: {
    player1: (parent) => getUser(parent.player1ID),
    player2: (parent) => parent.type === "COMPUTER" ? null : getUser(parent.player2ID),
  }
}

export default resolvers;
