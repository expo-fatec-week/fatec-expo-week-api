import express from "express";
import db from "../services/pessoaService.js";

const router = express.Router();

router.get('/', async (request, response) => {
  try {
    const results = await db.findPessoa();

    if (results.length == 0) {
      response.status(204).end();
    } else {
      response.status(200).json(results);
    }
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});

router.post('/', async (request, response) => {
  let { name, email, tel, ra, cpf, curso, periodo } = request.body;

  if (cpf) cpf = cpf.match(/\d/g).join("");

  try {
    if (!ra) ra = 0;
    await db.newPessoa(name, email, tel, ra, cpf, curso, periodo);
    response.status(201).json({ msg: `Bem vindo à Fatec Expo Week ${name}. Aproveite o Evento 😄` });
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});

export default router;