import jwt from 'jsonwebtoken';

function generateToken(user, eventId) {

  const secret = process.env.SECRET_JWT;

  return jwt.sign({ user, eventId }, secret, { expiresIn: 60 * 60 * 5 });
}

export { generateToken };