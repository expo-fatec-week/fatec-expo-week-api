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

    static admin = (middleware: any) => {
        const allowedRole = 'ADMINISTRADOR';
        return async (req: any, res: any, next: any) => {
            if (req.headers.authorization) {
                const userRequest: any = jwt.decode(req.headers.authorization?.split('Bearer ')[1]);

                if (allowedRole === userRequest.userType.toUpperCase()) {
                    middleware(req, res, next);
                } else {
                    res.status(403).send('Usuário não tem permissão para acessar esse recurso.');
                }
            }
        };
    };

    static organizer = (middleware: any) => {
        const adminRole = 'ADMINISTRADOR';
        return async (req: any, res: any, next: any) => {
            if (req.headers.authorization) {
                const userRequest: any = jwt.decode(req.headers.authorization?.split('Bearer ')[1]);
                const allowedRoles = [EnumTipoAluno.ORGANIZADOR, adminRole];

                if (allowedRoles.indexOf(userRequest.userType.toUpperCase()) !== -1) {
                    middleware(req, res, next);
                } else {
                    res.status(403).send('Usuário não tem permissão para acessar esse recurso.');
                }
            }
        };
    };

    static exhibitor = (middleware: any) => {
        const adminRole = 'ADMINISTRADOR';
        return async (req: any, res: any, next: any) => {
            if (req.headers.authorization) {
                const userRequest: any = jwt.decode(req.headers.authorization?.split('Bearer ')[1]);
                const allowedRoles = [adminRole, EnumTipoAluno.ORGANIZADOR, EnumTipoAluno.EXPOSITOR];

                if (allowedRoles.indexOf(userRequest.userType.toUpperCase()) !== -1) {
                    middleware(req, res, next);
                } else {
                    res.status(403).send('Usuário não tem permissão para acessar esse recurso.');
                }
            }
        };
    };

}

export default Session;
