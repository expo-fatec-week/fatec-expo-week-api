import express from 'express';
import db from '../services/loginService.js';

import { generateToken } from '../helpers/login.js'

const router = express.Router();

router.post('/', async (request, response) => {

  const { userName, password } = request.body;

  try {
    const results = await db.login(userName, password);

    if (results.length == 0) {
      response.status(401).json({ message: 'Login ou senha invalidos' });
    } else {
      const { id_login, nome_usuario } = results[0];
      const token = generateToken(id_login, nome_usuario);
      response.status(200).json({ message: 'Login efetuado com sucesso', token });
    }
  } catch (err) {
    response.status(500).json({ message: `Erro no servidor: ${err}` });
  }

});

export default router;