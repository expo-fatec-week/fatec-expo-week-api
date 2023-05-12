import Router from 'express';
import authStrategy from '../config/security/strategy';
import Session from '../config/security/session';
import AdministratorController from '../controllers/AdministratorController';

const admin = Router();

admin.route('/administration/update')
    .all(authStrategy())
    .post(Session.admin(AdministratorController.update));

admin.route('/administration/courses')
    .all(authStrategy())
    .get(Session.admin(AdministratorController.listCourses));

admin.route('/administration/courses/:courseId/students-with-events')
    .all(authStrategy())
    .get(Session.admin(AdministratorController.listStudentsWithEventsParticipatedByCourses));

export default admin;
