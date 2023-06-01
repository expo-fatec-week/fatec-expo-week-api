import { Request, Response } from 'express';
import AdministratorService from '../services/AdministratorService';
import ExportCSV from '../config/resources/ExportCSV';

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
        const { courseId } = req.params;
        try {
            const response = await AdministratorService.listDetailsParticipatedByCourse(courseId);
            const fields = [
                { label: 'RA', value: 'ra' },
                { label: 'NOME', value: 'nome' },
                { label: 'E-MAIL', value: 'email' },
                { label: 'DESCRICAO', value: 'descricao' },
                { label: 'TIPO', value: 'tipo' },
                { label: 'DATA DO EVENTO', value: 'data_evento' }
            ];
            return ExportCSV.downloadCSV(res, 'alunos_e_cursos', fields, response);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async listDetailsParticipatedByPerson(req: Request, res: Response) {
        const { personId } = req.params;
        try {
            const response = await AdministratorService.listDetailsParticipatedByPerson(personId);
            return res.status(response.status).json(response.events);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default AdministratorController;