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

router.post('/generate-code', async (request, response) => {
    const { id_pessoa, id_evento } = request.body;
    try {
        if (!id_pessoa || !id_evento) return response.status(400).json({ message: 'Faltam informações para gerar o codigo de validação do evento.' });
        const code = await db.generateCodeValidation(id_pessoa, id_evento);
        return response.status(200).json(code);
    } catch (error) {
        response.status(500).json({ message: `Encontramos um erro: ${err}` })
    }
});

router.post('/confirm-presence', async (request, response) => {
    const { id_pessoa, id_evento, cod_validacao } = request.body;
    try {
        if (!id_pessoa || !id_evento || !cod_validacao) return response.status(400).json({ message: 'Faltam informações para validar a presença no evento.' });
        const res = await db.confirmPresence(id_pessoa, id_evento, cod_validacao);
        return response.status(200).json(res);
    } catch (error) {
        response.status(500).json({ message: `Encontramos um erro: ${err}` })
    }
});

export default router;
