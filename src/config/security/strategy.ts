require('dotenv').config();
import db from '../database/database';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Administrador, QueryLoginStudent, QueryLoginVisitor } from '../../models/Login';

function verifyUser(user: QueryLoginStudent | QueryLoginVisitor | Administrador) {
    if (!user) {
        throw new Error('Usuário não existe!');
    }
}

passport.use(
    new Strategy({
        secretOrKey: process.env.AUTH_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, async (_payload, done: Function) => {
        try {
            let user: QueryLoginStudent | QueryLoginVisitor | Administrador;
            const conn = await db.connect();
            if (_payload.ra) {
                user = await db.findFirst(conn, 'SELECT * FROM vw_aluno_info WHERE ra = ? AND email = ?', [_payload.ra, _payload.email]);
            } else if (_payload.senha) {
                user = await db.findFirst(conn, 'SELECT * FROM administradores WHERE email = ? AND senha = ?', [_payload.email, _payload.senha]);
            } else {
                user = await db.findFirst(conn, 'SELECT * FROM vw_visitante_info WHERE id_pessoa = ? AND email = ?', [_payload.personId, _payload.email])
            }

            verifyUser(user);

            done(null, user);
        } catch (error) {
            done(error);
        }
    }),
);

export default () => passport.authenticate('jwt', { session: false });
