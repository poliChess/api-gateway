import axios from 'axios';

const serviceUrl = 'http://matchmaking-service:3000';

async function getMatches(args?: { playerID: string }) {
  const res = await axios.get(`${serviceUrl}/match/current`, { data: args });
  return res.data;
}

async function getHistory(args: { playerID: string, before?: Date, after?: Date }) {
  const res = await axios.get(`${serviceUrl}/match/history`, { data: args });
  return res.data;
}

async function enterQueue(args: { playerID: string, playerRating: number, computer: boolean }) {
  const res = await axios.post(`${serviceUrl}/queue/enter`, args);
  return res.data;
}

async function leaveQueue(args: { playerID: string }) {
  const res = await axios.post(`${serviceUrl}/queue/leave`, args);
  return res.data;
}

export { getMatches, getHistory, enterQueue, leaveQueue }
