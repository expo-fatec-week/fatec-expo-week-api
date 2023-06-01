import Router from 'express';
import authStrategy from '../config/security/strategy';
import Session from '../config/security/session';
import AdministratorController from '../controllers/AdministratorController';

const admin = Router();

admin.route('/administration/update')
    .put(AdministratorController.update);

admin.route('/administration/visitors')
    .all(authStrategy())
    .get(Session.admin(AdministratorController.listVisitors));

admin.route('/administration/courses')
    .all(authStrategy())
    .get(Session.admin(AdministratorController.listCourses));

admin.route('/administration/courses/:courseId/students-with-events')
    .all(authStrategy())
    .get(Session.admin(AdministratorController.listStudentsWithEventsParticipatedByCourses));

admin.route('/administration/courses/:courseId/events-participated')
    .all(authStrategy())
    .get(Session.admin(AdministratorController.listDetailsParticipatedByCourse));

admin.route('/administration/person/:personId/events-participated')
    .all(authStrategy())
    .get(Session.admin(AdministratorController.listDetailsParticipatedByPerson));

export default admin;
