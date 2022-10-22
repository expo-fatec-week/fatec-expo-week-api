import express from 'express';
import db from "../services/eventoService.js";

const router = express.Router();

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

export default router;
