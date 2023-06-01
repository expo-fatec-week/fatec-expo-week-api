import db from '../config/database/database';
import bcrypt from 'bcrypt';
import { Administrador } from '../models/Login';
import { Cursos } from '../models/Entities';
import { StudentByCourse, StudentByCourseWithEvents } from '../models/Student';
import { ResponseVisitor } from '../models/Visitor';
import { ResponseEvent } from '../models/Event';

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
        const baseStudents: StudentByCourse[] = await db.findMany(conn,
            `SELECT DISTINCT a.ra, a.id_pessoa, p.nome, a.curso, e.id_evento
        FROM aluno a
        JOIN pessoa p ON a.id_pessoa = p.id_pessoa
        JOIN participacoes pa ON a.id_pessoa = pa.id_pessoa_participante
        JOIN evento e ON pa.id_evento = e.id_evento WHERE curso = ?`, [courseId]);
        conn.end();

        let students: StudentByCourse[] = [];
        const setAluno = new Set();
        baseStudents.forEach((student) => {
            delete student.id_evento;
            let qtdEventos = 0;
            baseStudents.forEach((alunoInterno) => {
                if (alunoInterno.id_pessoa === student.id_pessoa) {
                    qtdEventos++;
                }
            });
            students.push({ ...student, qtd_eventos_participados: qtdEventos });
        });

        let filteredStudents: any[] = students.filter((student) => {
            const alunoDuplicado = setAluno.has(student.id_pessoa);
            setAluno.add(student.id_pessoa);
            return !alunoDuplicado;
        });

        if (baseStudents.length > 0) {
            return { status: 200, students: filteredStudents }
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

    static async listDetailsParticipatedByCourse(courseId: string) {
        const conn = await db.connect();
        try {
            // const students: StudentByCourse[] = await db.findMany(conn, 'SELECT * FROM vw_aluno_eventos_por_curso WHERE curso = ?', [courseId]);
            const students: StudentByCourse[] = await db.findMany(conn,
                `SELECT DISTINCT a.ra, a.id_pessoa, p.nome, a.curso
                FROM aluno a
                JOIN pessoa p ON a.id_pessoa = p.id_pessoa
                JOIN participacoes pa ON a.id_pessoa = pa.id_pessoa_participante
                JOIN evento e ON pa.id_evento = e.id_evento
                WHERE curso = ?;`
                , [courseId]);

            let idPeople: number[] = [];

            students.forEach((student) => {
                idPeople.push(student.id_pessoa);
            });

            const studentsWithEvents: StudentByCourseWithEvents[] = await db.findMany(conn,
                `SELECT a.ra, p.nome, p.email, e.descricao, e.tipo, e.data_evento
                FROM evento e
                JOIN participacoes b ON e.id_evento = b.id_evento
                JOIN pessoa p ON b.id_pessoa_participante = p.id_pessoa
                JOIN aluno a ON a.id_pessoa = p.id_pessoa
                WHERE b.id_pessoa_participante IN (?);`,
                [idPeople]);

            const response = studentsWithEvents.map((student) => {
                const currentDate = new Date(student.data_evento.toString().replace(/-/g, '/').replace(/z/g, '')).toISOString();
                const dd = currentDate.toString().substr(8, 2);
                const MM = currentDate.toString().substr(5, 2);
                const yyyy = currentDate.toString().substr(0, 4);
                const date = `${dd}/${MM}/${yyyy}`;

                const hh = currentDate.substr(11, 2);
                const mm = currentDate.substr(14, 2);
                const ss = currentDate.substr(17, 2);
                const time = `${hh}:${mm}:${ss}`;

                const data = `${date} ${time}`;

                return { ...student, data_evento: data }
            });

            return response;
        } catch (error) {
            return { status: 500, message: error }
        } finally {
            conn.end();
        }
    }

    static async listDetailsParticipatedByPerson(personId: string) {
        const conn = await db.connect();
        const events: ResponseEvent[] = await db.findMany(conn,
            `SELECT DISTINCT e.id_evento, e.descricao, e.tipo, e.local, e.data_evento, e.dt_verificacao 
            FROM evento e
            JOIN participacoes p ON e.id_evento = p.id_evento
            WHERE id_pessoa_participante = ?;`,
            [personId]);
        conn.end();
        return { status: 200, events };
    }

}

export default AdministratorService;