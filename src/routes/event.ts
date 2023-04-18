import Router from 'express';
import EventController from '../controllers/EventController';

const event = Router();

event.route('/event')
    .get(EventController.list);

event.route('/event/lecture/generate-code')
    .post(EventController.generateCode);

event.route('/event/lecture/confirm-presence')
    .post(EventController.validadeLecture);

event.route('/event/exhibit')
    .post(EventController.validadeExhibit);

export default event;
