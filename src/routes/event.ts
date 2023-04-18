import Router from 'express';
import authStrategy from '../config/security/strategy';
import EventController from '../controllers/EventController';
import Session from '../config/security/session';

const event = Router();

event.route('/event')
    .all(authStrategy())
    .get(EventController.list);

event.route('/event/lecture/generate-code')
    .all(authStrategy())
    .post(Session.organizer(EventController.generateCode));

event.route('/event/lecture/confirm-presence')
    .all(authStrategy())
    .post(EventController.validadeLecture);

event.route('/event/exhibit')
    .all(authStrategy())
    .post(Session.exhibitor(EventController.validadeExhibit));

export default event;
