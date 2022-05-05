import { AuthenticationError } from 'apollo-server';

import { Identity } from '../jwt';

type SyncResolver = (parent: any, args: any, context: { identity: Identity }) => any;
type AsyncResolver = (parent: any, args: any, context: { identity: Identity }) => Promise<any>

export type Resolver = SyncResolver | AsyncResolver
export type Root = { [type: string]: { [type: string]: Resolver } } 

const statusGood = {success: true, message: 'ok'};
const statusBad = (msg: string) => ({success: false, message: msg});

function authThen(resolver: Resolver): Resolver {
  return async (parent, args, context) => {
    if (!context.identity)
      throw new AuthenticationError('you must be logged in');

    return resolver(parent, args, context);
  }
}

export { statusGood, statusBad, authThen }
