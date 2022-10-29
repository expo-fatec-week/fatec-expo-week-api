import express from 'express';
import db from '../services/agendaService.js';

const router = express.Router();

router.post('/', async (request, response) => {

  const { eventId, userId } = request.body;
  const validacao = 0;

  try {
    eventId.forEach(async (event) => {
      await db.setAgenda(event, userId, validacao);
    });
    response.status(201).json('Evento registrado na agenda.');
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});

router.put('/', async (request, response) => {
  const { idEvento, idPessoa, qmValidou, dataHora } = request.body;
  const { validacao } = 1
  try {
    const results = await db.selectAgenda(idPessoa)
    if (results > 15) {
      await db.upAgenda(idEvento, idPessoa, validacao, qmValidou, dataHora);
      response.status(201).json('Validação feita com sucesso!');
    } else {
      response.status(406/*Not Acceptable*/).json('Não faz tanto tempo que essa pessoa assistiu a um evento, peça que retorne mais tarde!');
    }
  } catch (err) {
    response.status(500).json(`Houve um erro: ${err}`);
  }
});

router.get('/:userId', async (request, response) => {

  const { userId } = request.params;

  try {
    const results = await db.findEvent(userId);

    if (results.length == 0) {
      response.status(204).end();
    } else {
      response.status(200).json(results);
    }
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});

router.get('/viewed-events/:userId', async (request, response) => {

  const { userId } = request.params;

  try {
    const results = await db.listViewedEvents(userId);

    if (results.length === 0) {
      response.status(204).end();
    } else {
      response.status(200).json(results);
    }
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});

export default router;
