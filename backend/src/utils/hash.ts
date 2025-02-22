import * as argon2 from 'argon2';

export const hash = (plain: string) => {
  return argon2.hash(plain);
};

export const compare = (hash: string, plain: string) => {
  return argon2.verify(hash, plain);
};
