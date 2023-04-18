import Router from 'express';
import VisitorController from '../controllers/VisitorController';

const visitor = Router();

visitor.route('/visitor')
    .post(VisitorController.create);

export default visitor;
