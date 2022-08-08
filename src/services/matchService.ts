import axios from 'axios';

import discovery from '../grpc/discovery';

let addr: string | null = null;
const serviceAddr = async () => {
  while (!addr) {
    const res = await discovery.get('matchmaking-service');

    if (res.status.success) {
      addr = res.service.serviceAddr;
    } else {
      console.warn(res.status.message);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return addr;
};

async function getMatches(args?: { playerID: string }) {
  const res = await axios.get(`http://${await serviceAddr()}/match/current`, { data: args });
  if (!res.data) return null;
  return res.data;
}

async function getHistory(args: { playerID: string, before?: Date, after?: Date }) {
  const res = await axios.get(`http://${await serviceAddr()}/match/history`, { data: args });
  return res.data;
}

async function enterQueue(args: { playerID: string, playerRating: number, computer: boolean }) {
  const res = await axios.post(`http://${await serviceAddr()}/queue/enter`, args);
  return res.data;
}

async function leaveQueue(args: { playerID: string }) {
  const res = await axios.post(`http://${await serviceAddr()}/queue/leave`, args);
  return res.data;
}

export { getMatches, getHistory, enterQueue, leaveQueue }
