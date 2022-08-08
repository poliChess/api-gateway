import { createClient } from "@urql/core";
import getClient from "../redis";

import discovery from "../grpc/discovery";

let client: any = null;
const gqlClient = async () => {
  while (!client) {
    const res = await discovery.get('user-service');

    if (res.status.success) {
      client = createClient({ url: `http://${res.service.serviceAddr}/graphql` });
    } else {
      console.warn(res.status.message);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return client;
}

const queries = {
  user: `query($id: ID!) {
      user(id: $id) {
        id
        mail
        username
        avatar
        playedGames
        wonGames
        rating
        lastLogin
      }
    }`,
  findUser: `query($username: String!) {
      findUser(username: $username) {
        id
        mail
        username
        avatar
        playedGames
        wonGames
        rating
        lastLogin
      }
    }`
}

const mutations = {
  authenticate: `mutation($username: String!, $password: String!){
      authenticate(username: $username, password: $password) {
        success
        message
        user {
          id
          mail
          username
          playedGames
          wonGames
          rating
          lastLogin
        }
      }
    }`,
  addUser: `mutation($mail: String!, $username: String!, $password: String!) {
      addUser(mail: $mail, username: $username, password: $password) {
        success
        message
      }
    }`,
  updateUser: `mutation($id: ID!, $mail: String, $username: String, $password: String, $avatar: String) {
      updateUser(id: $id, mail: $mail, username: $username, password: $password, avatar: $avatar) {
        success
        message
        user {
          id
          mail
          username
          avatar
          playedGames
          wonGames
          rating
          lastLogin
        }
      }
    }`,
  deleteUser: `mutation($id: ID!) {
      deleteUser(id: $id) {
        success
        message
      }
    }`,
  googleLogin: `mutation($id: ID!, $mail: String, $username: String){
      getOrAddGoogleUser(id: $id, mail: $mail, username: $username) {
        success
        message
        user {
          id
          mail
          username
          playedGames
          wonGames
          rating
          lastLogin
        }
      }
    }`,
}

async function getUser(id: string) {
  const redis = await getClient();

  const cached = await redis.get(id);
  if (cached)
    return JSON.parse(cached);

  const gql = await gqlClient();
  const res = await gql.query(queries.user, { id }).toPromise();

  redis.set(id, JSON.stringify(res.data.user));
  return res.data.user;
}

async function findUser(username: string) {
  const redis = await getClient();

  const cachedID = await redis.get(username);
  if (cachedID) {
    return await getUser(cachedID);
  } else {
    const gql = await gqlClient();
    const res = await gql.query(queries.findUser, { username }).toPromise();

    if (res.data && res.data.findUser) {
      redis.set(username, res.data.findUser.id);
      redis.set(res.data.findUser.id, JSON.stringify(res.data.findUser));
    }

    return res.data.findUser;
  }
}

async function addUser(args: { mail: string, username: string, password: string }) {
  const gql = await gqlClient();
  const res = await gql.mutation(mutations.addUser, args).toPromise();
  return res.data.addUser;
}

async function authenticate(args: { username: string, password: string }) {
  const gql = await gqlClient();
  const res = await gql.mutation(mutations.authenticate, args).toPromise();

  if (res.data && res.data.authenticate.success) {
    const redis = await getClient();
    const user = res.data.authenticate.user;

    redis.set(user.id, JSON.stringify(user));
    redis.set(user.username, user.id);
  }

  return res.data.authenticate;
}

async function googleLogin(args: { id: string, mail?: string, username?: string }) {
  const gql = await gqlClient();
  const res = await gql.mutation(mutations.googleLogin, args).toPromise();

  if (res.data && res.data.getOrAddGoogleUser.success) {
    const redis = await getClient();
    const user = res.data.getOrAddGoogleUser.user;

    redis.set(user.id, JSON.stringify(user));
    redis.set(user.username, user.id);
  }

  return res.data.getOrAddGoogleUser;
}

async function updateUser(args: { id: string, mail: string, username: string, password: string }) {
  const gql = await gqlClient();
  const res = await gql.mutation(mutations.updateUser, args).toPromise();

  if (res.data && res.data.updateUser.success) {
    const redis = await getClient();
    const user = res.data.updateUser.user;

    redis.set(user.id, JSON.stringify(user));
    redis.set(user.username, user.id);
  }

  return res.data.updateUser;
}

async function deleteUser(id: string) {
  const redis = await getClient();
  const user = await getUser(id);
  redis.del(id);
  redis.del(user.username);

  const gql = await gqlClient();
  const res = await gql.mutation(mutations.deleteUser, { id }).toPromise();
  return res.data.deleteUser;
}

export { addUser, getUser, findUser, authenticate, updateUser, deleteUser, googleLogin }
