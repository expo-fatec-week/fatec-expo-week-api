import Router from 'express';
import StudentController from '../controllers/StudentController';

const student = Router();

student.route('/student/confirmed-events/:personId')
    .get(StudentController.listEvents);

export default student;
