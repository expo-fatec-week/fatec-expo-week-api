import db from '../config/database/database';
import { ResponseEvent } from '../models/Event';
import { QueryLoginStudent } from '../models/Login';
import jwt from 'jsonwebtoken';
import { Student } from '../models/Student';

class StudentService {

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

    static async listEvents(personId: string) {
        const conn = await db.connect();
        const events: ResponseEvent[] = await db.findMany(conn, 'SELECT * FROM vw_meus_eventos WHERE id_pessoa = ? ORDER BY data_validacao DESC', [personId]);
        conn.end();
        return events;
    }

    static async listStudentsAndVisitors() {
        const conn = await db.connect();
        const students: Student[] = await db.findMany(conn, 'SELECT id_pessoa, nome FROM pessoa;');
        conn.end();
        return students;
    }

}

export default StudentService;