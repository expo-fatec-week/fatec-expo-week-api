import express from 'express';
import db from '../services/loginService.js';

import { generateToken } from '../helpers/login.js'

const router = express.Router();

router.post('/', async (request, response) => {

  const { user, password } = request.body;

  try {
    const results = await db.login(user, password);

    if (results.length == 0) {
      response.status(401).json({ message: 'Login ou senha invalidos' });
    } else {
      const { usuario, id_evento } = results[0];
      const token = generateToken(usuario, id_evento);
      response.status(200).json({ message: 'Login efetuado com sucesso', token });
    }
  } catch (err) {
    response.status(500).json({ message: `Erro no servidor: ${err}` });
  }

});

export default router;