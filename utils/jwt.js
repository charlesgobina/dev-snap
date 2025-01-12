import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createJWT = (user) => {
  const token = jwt.sign({
    id: user.uid,
    username: user.email,
  }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
  return token;
}