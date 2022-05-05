import jwt from 'jsonwebtoken';

export type Identity = { id: string, expires_at: Date };

const secret = 'superdupersecretshhhhh';
const lifespan = (hours: number) => Date.now() + (hours * 60 * 60 * 1000);

function create(payload: { id: string }) {
  return jwt.sign(
    { id: payload.id, expires_at: lifespan(2) },
    secret, { noTimestamp: true }
  );
}

function verify(token: string): Identity | null {
  try {
    const identity: any = jwt.verify(token, secret);

    if (identity.expires_at < Date.now())
      return null;

    return identity;
  } catch (err) {
    return null;
  }
}

export default { create, verify }
