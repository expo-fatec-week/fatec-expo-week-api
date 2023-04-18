import db from '../config/database/database';
import jwt from 'jsonwebtoken';
import { QueryLoginVisitor } from '../models/Login';
import { RequestVisitor } from '../models/Visitor';

class VisitorService {

    static async sigIn(cpf: string) {
        const conn = await db.connect();
        const visitor: QueryLoginVisitor = await db.findFirst(conn, 'SELECT * FROM vw_visitante_info WHERE cpf = ? ', [cpf]);
        conn.end();

        const now = Math.floor(Date.now() / 1000);

        if (visitor) {
            const payload = {
                name: visitor.nome,
                email: visitor.email,
                personId: visitor.id_pessoa,
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

    static async create(requestVisitor: RequestVisitor) {
        const { name, email, tel, cpf } = requestVisitor;
        const conn = await db.connect();
        await conn.query('call insPAV(?, ?, ?, ?, ?, ?, ?)', [name, email, tel, 0, cpf, null, null]);
        conn.end();
    }

}

export default VisitorService;