import express from "express";

import pessoa from './controllers/pessoaController.js';
import login from './controllers/loginController.js';
import events from './controllers/eventoController.js';
import student from './controllers/alunoController.js';
import schedule from './controllers/agendaController.js';
import checkout from './controllers/checkoutController.js';

const router = express.Router();

router.use('/user', pessoa);
router.use('/login', login);
router.use('/events', events);
router.use('/student', student);
router.use('/schedule', schedule);
router.use('/checkout', checkout);

export default router;