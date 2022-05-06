import axios from 'axios';

const serviceUrl = 'http://game-engine-service:3000/engine';

async function suggetMove(fen: string) {
  console.log(fen);
  const res = await axios.post(`${serviceUrl}/move/suggest`, { fen });
  console.log(res);
  return res.data;
}

async function validateMove(fen: string, move: string) {
  const res = await axios.post(`${serviceUrl}/move/validate`, { fen, move });
  return res.data;
}

export { suggetMove, validateMove }
