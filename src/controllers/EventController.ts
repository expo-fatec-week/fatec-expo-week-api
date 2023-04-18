import { Request, Response } from 'express';
import EventService from '../services/EventService';
import { RequestGenerateCode, RequestValidateExhibit, RequestValidateLecture } from '../models/Event';

class EventController {

    static async list(req: Request, res: Response) {
        try {
            const response = await EventService.list();
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    static async generateCode(req: Request, res: Response) {
        const requestGenerateCode: RequestGenerateCode = req.body;
        try {
            if (!requestGenerateCode.id_evento || !requestGenerateCode.id_pessoa) return res.status(400).json({ message: 'Faltam informações para gerar o codigo de validação do evento.' });
            const code = await EventService.generateCode(requestGenerateCode);
            return res.status(201).json(code);
        } catch (error) {
            return res.status(500).json(error);
        }

    }

    static async validadeLecture(req: Request, res: Response) {
        const requestValidateLecture: RequestValidateLecture = req.body;
        try {
            if (!requestValidateLecture.id_evento
                || !requestValidateLecture.id_pessoa
                || !requestValidateLecture.cod_validacao) {
                return res.status(400).json({ message: 'Faltam informações para validar o evento.' });
            }

            const response = await EventService.validadeLecture(requestValidateLecture);
            return res.status(201).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }

    }

    static async validadeExhibit(req: Request, res: Response) {
        const requestValidateExhibit: RequestValidateExhibit = req.body;
        try {
            if (!requestValidateExhibit.id_evento
                || !requestValidateExhibit.id_pessoa_participante
                || !requestValidateExhibit.id_pessoa_validacao) {
                return res.status(400).json({ message: 'Faltam informações para validar o evento.' });
            }
            const response = await EventService.validadeExhibit(requestValidateExhibit);
            return res.status(201).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }

    }

}

export default EventController;