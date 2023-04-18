import { Router } from 'express';
import auth from './auth';
import visitor from './visitor';
import event from './event';
import student from './student';


const router = Router();

router.use(auth);
router.use(visitor);
router.use(event);
router.use(student);

export default router;
