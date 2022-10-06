import express from 'express';
import db from '../services/aegndaService.js';

const router = express.Router();

router.post('/', async (request, response) => {
  try {
    const { idEvento, idPessoa } = request.body;
    const { validacao } = 0;

    await db.setAgenda(idEvento, idPessoa, validacao);
    response.status(201).json('Evento registrado na agenda.');
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});
