import { Router } from 'express';
import auth from './auth';
import visitor from './visitor';
import event from './event';
import student from './student';
import admin from './administrator';


const router = Router();

router.use(auth);
router.use(visitor);
router.use(event);
router.use(student);
router.use(admin);

export default router;
