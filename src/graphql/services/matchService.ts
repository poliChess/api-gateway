import { createClient } from "@urql/core";

const client = createClient({
  url: 'http://localhost:3002/graphql'
})

const MATCHES = `
  query {
    matches {
      id
      type
      player1ID
      player2ID
      status
      winner
      toMove
      state
      moves
      startedAt
      finishedAt
    }
  }
`;

async function getMatches() {
  const result = await client.query(MATCHES).toPromise();
  return result.data.matches;
}

export { getMatches }
