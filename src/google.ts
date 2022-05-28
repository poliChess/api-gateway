import { OAuth2Client } from 'google-auth-library';

const clientId = "332864392841-e914g390g6h9a1a3rt9m48ol63u0om0h.apps.googleusercontent.com";
const client = new OAuth2Client(clientId);

async function verify(idToken: string) {
  const ticket = await client.verifyIdToken({
      idToken, audience: clientId
  });

  const payload = ticket.getPayload();

  return payload;
}

export default { verify };
