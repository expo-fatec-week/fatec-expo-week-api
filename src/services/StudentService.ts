import db from '../config/database/database';
import { ResponseEvent } from '../models/Event';
import { Student } from '../models/Student';

class StudentService {

    static async listEvents(personId: string) {
        const conn = await db.connect();
        const events: ResponseEvent[] = await db.findMany(conn, 'SELECT * FROM vw_meus_eventos WHERE id_pessoa = ?', [personId]);
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