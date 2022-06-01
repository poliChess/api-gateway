import { OAuth2Client } from 'google-auth-library';

const clientId = "202173917816-q127ko40g6h9d2rvcsmjmdsj8kupmpro.apps.googleusercontent.com";
const client = new OAuth2Client(clientId);

async function verify(idToken: string) {
  const ticket = await client.verifyIdToken({
      idToken, audience: clientId
  });

  const payload = ticket.getPayload();

  return payload;
}

export default { verify };
