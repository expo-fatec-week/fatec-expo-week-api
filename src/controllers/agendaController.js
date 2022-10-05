import express from 'express';
import db from '../services/aegndaService.js';

const router = express.Router();

router.post('/', [/*Middleware se necessário*/], async (request, response) => {
  try {
    const {idEvento, idPessoa} = request.body;
    const {validacao} = 0;
    response.status(201).json('Evento registrado na agenda.');
  }
  catch(err) {
  /*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
  | (Müller) vou terminar em     |
  | casa.                        |
  \_____________________________*/
  })
