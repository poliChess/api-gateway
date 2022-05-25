import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

let client: RedisClientType | null = null;

async function getClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient({
      url: 'redis://redis:test@redis:6380'
    });
    client.on('error', (err) => console.warn(`redis: ${err}`));
    await client.connect();
  }

  return client;
}

export default getClient;
