import Router from 'express';
import AuthContoller from '../controllers/AuthContoller';
import VisitorController from '../controllers/VisitorController';
import StudentController from '../controllers/StudentController';

const auth = Router();

auth.route('/login')
    .post(AuthContoller.sigIn);

auth.route('/login/student')
    .post(StudentController.sigIn);

auth.route('/login/visitor')
    .post(VisitorController.sigIn);

export default auth;
