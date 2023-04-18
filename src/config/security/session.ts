/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import { EnumTipoAluno } from '../../models/Entities';

class Session {
    static async requestUser(token: string | undefined) {
        if (token) {
            const userRequest: any = jwt.decode(token?.split('Bearer ')[1]);

            return userRequest.id_pessoa;
        }
        return 0;
    }

    static organizer = (middleware: any) => {
        return async (req: any, res: any, next: any) => {
            if (req.headers.authorization) {
                const userRequest: any = jwt.decode(req.headers.authorization?.split('Bearer ')[1]);
                const allowedRoles = [EnumTipoAluno.ORGANIZADOR];

                if (allowedRoles.indexOf(userRequest.userType) !== -1) {
                    middleware(req, res, next);
                } else {
                    res.status(403).send('Usuário não tem permissão para acessar esse recurso.');
                }
            }
        };
    };

    static exhibitor = (middleware: any) => {
        return async (req: any, res: any, next: any) => {
            if (req.headers.authorization) {
                const userRequest: any = jwt.decode(req.headers.authorization?.split('Bearer ')[1]);
                const allowedRoles = [EnumTipoAluno.ORGANIZADOR, EnumTipoAluno.EXPOSITOR];

                if (allowedRoles.indexOf(userRequest.userType) !== -1) {
                    middleware(req, res, next);
                } else {
                    res.status(403).send('Usuário não tem permissão para acessar esse recurso.');
                }
            }
        };
    };

}

export default Session;
