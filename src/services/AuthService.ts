import db from '../config/database/database';
import jwt from 'jsonwebtoken';
import { QueryLoginStudent } from '../models/Login';

class AuthService {

    static async sigIn(ra: string, email: string) {
        const conn = await db.connect();
        const user: QueryLoginStudent = await db.findFirst(conn, 'SELECT * FROM vw_aluno_info WHERE ra = ? AND email = ?', [ra, email]);
        conn.end();

        const now = Math.floor(Date.now() / 1000);

        if (user) {
            const payload = {
                name: user.nome,
                email: user.email,
                ra: user.ra,
                userType: user.tipo,
                personId: user.id_pessoa,
                respEventId: user.responsavel_evento,
                iat: now,
                exp: now + (60 * 240),
                type: 'Bearer',
            };

            return {
                access_token: jwt.sign(payload, `${process.env.AUTH_SECRET}`)
            }
        };

        return null

    }

}

export default AuthService;