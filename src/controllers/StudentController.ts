import { Request, Response } from 'express';
import StudentService from '../services/StudentService';

class StudentController {

    static async listEvents(req: Request, res: Response) {
        const { personId } = req.params;
        try {
            const response = await StudentService.listEvents(personId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    static async listStudents(req: Request, res: Response) {
        try {
            const students = await StudentService.listStudents();
            return res.status(200).json(students);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default StudentController;