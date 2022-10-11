import express from "express";

import pessoa from './controllers/pessoaController.js';
import login from './controllers/loginController.js';
import eventos from './controllers/eventoController.js'
import student from './controllers/alunoController.js'

const router = express.Router();

router.use('/user', pessoa);
router.use('/login', login);
router.use('/eventos', eventos);
router.use('/student', student);


export default router;