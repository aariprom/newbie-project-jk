import dotenv from 'dotenv';

console.log(process.cwd());

dotenv.config({ path: '.env.local'});

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
