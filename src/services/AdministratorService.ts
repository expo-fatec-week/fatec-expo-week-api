import db from '../config/database/database';
import bcrypt from 'bcrypt';
import { Administrador } from '../models/Login';
import { Cursos } from '../models/Entities';
import { StudentByCourse } from '../models/Student';
import { ResponseVisitor } from '../models/Visitor';

class AdministratorService {

    static async update(email: string, password: string, newPassword: string) {
        const conn = await db.connect();
        try {
            const user: Administrador = await db.findFirst(conn, 'SELECT * FROM administradores WHERE email = ?;', [email]);

            if (user) {
                const validPassword = bcrypt.compareSync(password, user.senha);

                if (validPassword) {

                    const salt = bcrypt.genSaltSync(12);
                    const currentPassword = bcrypt.hashSync(newPassword, salt);

                    await db.executeQuery(conn, 'UPDATE administradores SET senha = ? WHERE email = ?', [currentPassword, email])

                    return { status: 200, message: 'Senha atualizada com sucesso!' }
                }
                return { status: 400, message: 'Senha antiga invalida.' }

            }

            return { status: 400, message: 'Usuário não encontrado' }

        } catch (error) {
            return { status: 500, message: error }
        } finally {
            conn.end();
        }
    }

    static async listCourses() {
        const conn = await db.connect();
        const courses: Cursos[] = await db.findMany(conn, 'SELECT * FROM cursos;');
        conn.end();

        if (courses.length > 0) {
            return { status: 200, courses }
        }
        return { status: 204, message: 'Não existem cursos cadastrados.' }
    }

    static async listStudentsWithEventsParticipatedByCourses(courseId: number) {
        const conn = await db.connect();
        const students: StudentByCourse[] = await db.findMany(conn, 'SELECT * FROM vw_aluno_eventos_por_curso WHERE curso = ?', [courseId]);
        console.log(students)
        conn.end();

        if (students.length > 0) {
            return { status: 200, students }
        }
        return { status: 204, message: 'Nenhum aluno deste curso participou do evento.' }
    }

    static async listVisitors() {
        const conn = await db.connect();
        const visitors: ResponseVisitor[] = await db.findMany(conn, 'SELECT * FROM vw_visitante_info;');
        conn.end();

        if (visitors.length > 0) {
            return { status: 200, visitors }
        }
        return { status: 204, message: 'Não existem visitantes cadastrados.' }
    }

}

export default AdministratorService;