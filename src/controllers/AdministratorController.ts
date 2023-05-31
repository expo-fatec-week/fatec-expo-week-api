import { Request, Response } from 'express';
import AdministratorService from '../services/AdministratorService';

class AdministratorController {

    static async update(req: Request, res: Response) {
        const { email, password, newPassword } = req.body;

        try {
            if (!email || !password || !newPassword) {
                return res.status(400).json({ message: 'Informe usuário, senha atual e nova senha!' });
            }
            const response = await AdministratorService.update(email, password, newPassword);
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

    static async listVisitors(req: Request, res: Response) {
        try {
            const response = await AdministratorService.listVisitors();
            return res.status(response.status).json(response.visitors ?? response.message);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async listDetailsParticipatedByCourse(req: Request, res: Response) {
        try {
            const response = await AdministratorService.listDetailsParticipatedByCourse();
            return res.status(response.status).json(response.message);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async listDetailsParticipatedByPerson(req: Request, res: Response) {
        try {
            const response = await AdministratorService.listDetailsParticipatedByPerson();
            return res.status(response.status).json(response.message);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default AdministratorController;