import express, { request, response } from "express";
import db from "../services/alunoService.js";

const router = express.Router();

router.get('/:ra', async (request, response) => {
  const { ra } = request.params
  const results = await db.findAluno(ra);
  try {
    if (results.length == 0) {
      response.status(204).end();
    } else {
      response.status(200).json(results);
    }
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});

export default router;