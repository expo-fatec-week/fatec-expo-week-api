import { Request, Response } from 'express';
import AdministratorService from '../services/AdministratorService';

class AdministratorController {

    static async update(req: Request, res: Response) {
        const { email, oldPassword, newPassword } = req.body;
        try {
            if (!email || !oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Informe usuário, senha atual e nova senha!' });
            }

            const response = await AdministratorService.update(email, oldPassword, newPassword);
            return res.status(response.status).json(response.message);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async listCourses(req: Request, res: Response) {
        try {
            const response = await AdministratorService.listCourses();
            return res.status(response.status).json(response.courses ?? response.message);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async listStudentsWithEventsParticipatedByCourses(req: Request, res: Response) {
        const { courseId } = req.params;
        try {
            const response = await AdministratorService.listStudentsWithEventsParticipatedByCourses(Number(courseId));
            return res.status(response.status).json(response.students ?? response.message);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default AdministratorController;