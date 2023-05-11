import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class AuthContoller {

    static async sigIn(req: Request, res: Response) {
        const { email, senha } = req.body;
        try {
            if (!email || !senha) {
                return res.status(400).json({ message: 'Informe usuário e senha!' });
            }

            const response = await AuthService.sigIn(email, senha);

            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

}

export default AuthContoller;