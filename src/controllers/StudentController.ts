import { Request, Response } from 'express';
import StudentService from '../services/StudentService';

class StudentController {

    static async sigIn(req: Request, res: Response) {
        const { ra, email } = req.body;
        try {
            if (!ra || !email) {
                return res.status(400).json({ message: 'Informe usuário e senha!' });
            }

            const response = await StudentService.sigIn(ra, email);

            if (!response) {
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    static async listEvents(req: Request, res: Response) {
        const { personId } = req.params;
        try {
            const response = await StudentService.listEvents(personId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    static async listStudentsAndVisitors(req: Request, res: Response) {
        try {
            const students = await StudentService.listStudentsAndVisitors();
            return res.status(200).json(students);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default StudentController;