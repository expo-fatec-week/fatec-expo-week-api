import express from "express";

import pessoa from './controllers/pessoaController.js';

const router = express.Router();

router.use('/user', pessoa);

export default router;