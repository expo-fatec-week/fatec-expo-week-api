import Router from 'express';
import StudentController from '../controllers/StudentController';
import authStrategy from '../config/security/strategy';
import Session from '../config/security/session';

const student = Router();


student.route('/student')
    .all(authStrategy())
    .get(Session.exhibitor(StudentController.listStudents));

student.route('/student/confirmed-events/:personId')
    .get(StudentController.listEvents);

export default student;
