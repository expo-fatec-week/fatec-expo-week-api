import { Request, Response } from 'express';
import VisitorService from '../services/VisitorService';
import { RequestVisitor } from '../models/Visitor';

class VisitorController {

    static async sigIn(req: Request, res: Response) {
        let { cpf } = req.body;
        try {
            if (!cpf) {
                return res.status(400).json({ message: 'Informe o cpf!' });
            }
            cpf = cpf.match(/\d/g).join("");
            const response = await VisitorService.sigIn(cpf);

            if (!response) {
                return res.status(400).json({ message: 'Usuário não encontrado! Crie seu cadastro e tente novamente.' });
            }

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    static async create(req: Request, res: Response) {
        const requestVisitor: RequestVisitor = req.body;
        let { cpf } = req.body;
        try {
            if (!cpf) return res.status(400).json({ message: 'Informe o cpf!' });
            if (!requestVisitor.aceitaTermo) return res.status(400).json({ message: 'Aceite o Termo de Uso para prosseguirmos com o seu cadastro.' })
            requestVisitor.cpf = cpf.match(/\d/g).join("");

            const response = await VisitorService.create(requestVisitor);

            return res.status(201).json({ message: `Bem vindo à Fatec Expo Week ${requestVisitor.name}. Aproveite o Evento 😄` })
        } catch (error) {
            return res.status(500).json(error);
        }

    }

}

export default VisitorController;