import express from "express";
import db from "../services/checkoutService.js";

const router = express.Router();

router.get('/:eventId', async (request, response) => {

  const { eventId } = request.params;
  
  try {
    const results = await db.findEventCheckout(eventId);
    if (results.length == 0) {
      response.status(204).end();
    } else {
      response.status(200).json(results);
    }
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});

router.put('/', async (request, response) => {

  const {validatedBy, code, person} = request.body;

  try {
    person.forEach(async (idPerson) => {
      await db.confirmEventCheckout(validatedBy, code, idPerson);
    });
    response.status(200).json({message: 'Obrigado por sua participação'});
  } catch (err) {
    response.status(500).json({ message: `Encontramos um erro: ${err}` });
  }
});

export default router;