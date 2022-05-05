import { createClient } from "@urql/core";

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
  findUser: `query($id: ID!) {
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
  addUser: `mutation ($mail: String!, $username: String!, $password: String!) {
      addUser(mail: $mail, username: $username, password: $password) {
        success
        message
      } 
    }`,
  updateUser: `

  `,
  deleteUser: `

  `,
}

async function getUser(id: string) {
  const res = await client.query(queries.user, { id }).toPromise();
  return res.data.user;
}

async function findUser(username: string) {
  const res = await client.query(queries.findUser, { username }).toPromise();
  return res.data.findUser;
}

async function addUser(args: {mail: string, username: string, password: string}) {
  const res = await client.mutation(mutations.addUser, args).toPromise();
  return res.data.addUser;
}

async function authenticate(args: {username: string, password: string}) {
  const res = await client.mutation(mutations.authenticate, args).toPromise();
  return res.data.authenticate;
}

export { addUser, getUser, findUser, authenticate }
