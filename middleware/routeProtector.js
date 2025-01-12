import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// middleware to protect routes
export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  const token = bearer.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
  
}