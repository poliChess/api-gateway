import axios from 'axios';
import discovery from '../grpc/discovery';

let addr: string = '';
const serviceUrl = async () => {
  while (!addr) {
    const res = await discovery.get('game-engine-service');

    if (res.status.success) {
      addr = res.service.serviceAddr;
    } else {
      console.warn(res.status.message);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return addr;
};

async function suggestMove(fen: string) {
  const res = await axios.post(`http://${await serviceUrl()}/engine/move/suggest`, { fen });
  return res.data;
}

async function validateMove(fen: string, move: string) {
  const res = await axios.post(`http://${await serviceUrl()}/engine/move/validate`, { fen, move });
  return res.data;
}

export { suggestMove, validateMove }
