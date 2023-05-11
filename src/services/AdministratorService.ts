import db from '../config/database/database';
import bcrypt from 'bcrypt';
import { Administrador } from '../models/Login';

class AdministratorService {

    static async update(email: string, oldPassword: string, newPassword: string) {
        const conn = await db.connect();
        try {
            const user: Administrador = await db.findFirst(conn, 'SELECT * FROM administradores WHERE email = ? AND senha = ?', [email, oldPassword]);

            if (user) {
                const salt = bcrypt.genSaltSync(12);
                const currentPassword = bcrypt.hashSync(newPassword, salt);

                await db.executeQuery(conn, 'UPDATE administradores SET senha = ? WHERE email = ?', [currentPassword, email])

                return { status: 200, message: 'Usuário atualizado com sucesso!' }
            }

            return { status: 400, message: 'Usuário não encontrado' }


        } catch (error) {
            return { status: 500, message: error }
        } finally {
            conn.end();
        }

    }

}

export default AdministratorService;