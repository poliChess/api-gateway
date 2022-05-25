import { createClient } from "@urql/core";
import getClient from "../redis";

const client = createClient({
  url: 'http://user-service:3000/graphql'
})

const queries = {
  user: `query($id: ID!) {
      user(id: $id) {
        id
        mail
        username
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
  updateUser: `mutation($id: ID!, $mail: String, $username: String, $password: String) {
      updateUser(id: $id, mail: $mail, username: $username, password: $password) {
        user {
          id
          mail
          username
          playedGames
          wonGames
          rating
          lastLogin
        }
        success
        message
      } 
    }`,
  deleteUser: `mutation($id: ID!) {
      deleteUser(id: $id) {
        success
        message
      }
    }`,
}

async function getUser(id: string) {
  const redis = await getClient();

  const cached = await redis.get(id);
  if (cached)
    return JSON.parse(cached);

  const res = await client.query(queries.user, { id }).toPromise();
  
  redis.set(id, JSON.stringify(res.data.user));
  return res.data.user;
}

async function findUser(username: string) {
  const redis = await getClient();

  const cachedID = await redis.get(username);
  if (cachedID) {
    return await getUser(cachedID);
  } else {
    const res = await client.query(queries.findUser, { username }).toPromise();

    if (res.data && res.data.findUser) {
      redis.set(username, res.data.findUser.id);
      redis.set(res.data.findUser.id, JSON.stringify(res.data.findUser));
    }

    return res.data.findUser;
  }
}

async function addUser(args: { mail: string, username: string, password: string }) {
  const res = await client.mutation(mutations.addUser, args).toPromise();
  return res.data.addUser;
}

async function authenticate(args: { username: string, password: string }) {
  const res = await client.mutation(mutations.authenticate, args).toPromise();
  return res.data.authenticate;
}

async function updateUser(args: { id: string, mail: string, username: string, password: string }) {
  const res = await client.mutation(mutations.updateUser, args).toPromise();
  return res.data.updateUser;
}

async function deleteUser(id: string) {
  const res = await client.mutation(mutations.deleteUser, { id }).toPromise();
  return res.data.deleteUser;
}

export { addUser, getUser, findUser, authenticate, updateUser, deleteUser }
