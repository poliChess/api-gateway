import jwt from '../jwt';
import google from '../google';

import { getMatches, getHistory, leaveQueue, enterQueue } from '../services/matchService';
import { authenticate, getUser, findUser, addUser, updateUser, deleteUser, googleLogin } from '../services/userService';
import { suggestMove, validateMove } from '../services/gameEngineService';

import { authThen, statusBad } from '../utils';
import { Root } from '../utils';

const resolvers: Root = {
  Query: {
    running: () => 'yes',

    me: authThen(({}, {}, context) => getUser(context.identity.id)),
    user: authThen(({}, args) => findUser(args.username)),

    matches: authThen(() => getMatches()),

    suggestMove: ({}, args) => suggestMove(args.fen),
    validateMove: ({}, args) => validateMove(args.fen, args.move),
  },

  Mutation: {
    register: ({}, args) => addUser(args),
    login: async ({}, args) => {
      let res: any;
      if (args.idToken) {
        const googleIdentity = await google.verify(args.idToken);
        if (!googleIdentity) return statusBad('bad id token');

        const payload = {
          id: googleIdentity.sub,
          mail: googleIdentity.email,
          username: googleIdentity.name
        };

        res = await googleLogin(payload);
      } else {
        res = await authenticate(args);
      }

      if (!res.success) return res;

      res.token = jwt.create({ id: res.user.id });
      return res;
    },

    updateUser: authThen(({}, args, context) => updateUser({ id: context.identity.id, ...args })),
    deleteUser: authThen(({}, {}, context) => deleteUser(context.identity.id)),

    enterQueue: authThen(async ({}, args, context) => { 
      const user = await getUser(context.identity.id);
      return enterQueue({ playerID: user.id, playerRating: user.rating, computer: args.computer });
    }),
    leaveQueue: authThen(({}, {}, context) => leaveQueue({ playerID: context.identity.id })),
  },

  User: {
    history: (parent, args) => getHistory({ playerID: parent.id, ...args }),
    currentGame: (parent) => getMatches({ playerID: parent.id }),
  },

  Match: {
    player1: (parent) => getUser(parent.player1ID),
    player2: (parent) => parent.type === "COMPUTER" ? null : getUser(parent.player2ID),
  }
}

export default resolvers;
