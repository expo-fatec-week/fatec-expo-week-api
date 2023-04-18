import db from '../config/database/database';
import { ResponseEvent } from '../models/Event';

class StudentService {

    static async listEvents(personId: string) {
        const conn = await db.connect();
        const events: ResponseEvent[] = await db.findMany(conn, 'SELECT * FROM vw_meus_eventos WHERE id_pessoa = ?', [personId]);
        conn.end();
        return events;
    }

}

export default StudentService;