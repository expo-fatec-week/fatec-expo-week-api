import jwt from 'jsonwebtoken';

function generateToken(idUser, userName) {

  const secret = process.env.SECRET_JWT;

  return jwt.sign({ infoUser: { idUser, userName } }, secret, { expiresIn: 60 * 60 * 24 });
}

export { generateToken };