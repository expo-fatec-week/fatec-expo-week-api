import db from '../database/database';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { QueryLoginStudent, QueryLoginVisitor } from '../../models/Login';

function verifyUser(user: QueryLoginStudent | QueryLoginVisitor) {
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
            let user: QueryLoginStudent | QueryLoginVisitor;
            const conn = await db.connect();
            if (_payload.ra) {
                user = await db.findFirst(conn, 'SELECT * FROM vw_aluno_info WHERE ra = ? AND email = ?', [_payload.ra, _payload.email]);
            } else {
                user = await db.findFirst(conn, 'SELECT * FROM vw_aluno_info WHERE id_pessoa = ? AND email = ?', [_payload.id_pessoa, _payload.email])
            }

            verifyUser(user);

            done(null, user);
        } catch (error) {
            done(error);
        }
    }),
);

export default () => passport.authenticate('jwt', { session: false });
