import express from "express";

import pessoa from './controllers/pessoaController.js';
import login from './controllers/loginController.js';

const router = express.Router();

router.use('/user', pessoa);
router.use('/login', login);

export default router;