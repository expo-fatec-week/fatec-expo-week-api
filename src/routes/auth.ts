import Router from 'express';
import AuthContoller from '../controllers/AuthContoller';
import VisitorController from '../controllers/VisitorController';

const auth = Router();

auth.route('/login')
    .post(AuthContoller.sigIn);

auth.route('/login/visitor')
    .post(VisitorController.sigIn);

export default auth;
