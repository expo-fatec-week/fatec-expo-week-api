import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class AuthContoller {

    static async sigIn(req: Request, res: Response) {
        const { ra, email } = req.body;
        try {
            if (!ra || !email) {
                return res.status(400).json({ message: 'Informe usuário e senha!' });
            }

            const response = await AuthService.sigIn(ra, email);

            if (!response) {
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

}

export default AuthContoller;