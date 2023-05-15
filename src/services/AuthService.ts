import db from '../config/database/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Administrador } from '../models/Login';

class AuthService {

    static async sigIn(email: string, password: string) {
        const conn = await db.connect();
        const user: Administrador = await db.findFirst(conn, 'SELECT * FROM administradores WHERE email = ?;', [email]);
        conn.end();

        if (user) {
            const validPassword = bcrypt.compareSync(password, user.senha);

            if (validPassword) {
                const now = Math.floor(Date.now() / 1000);

                const payload = {
                    name: user.nome,
                    email: user.email,
                    userType: 'ADMINISTRADOR',
                    iat: now,
                    exp: now + (60 * 240),
                    type: 'Bearer',
                };

                return { status: 200, access_token: jwt.sign(payload, `${process.env.AUTH_SECRET}`) }
            }
            return { status: 400, message: 'Senha invalida.' }
        }

        return { status: 400, message: 'Usuário não encontrado.' }

    }

}

export default AuthService;