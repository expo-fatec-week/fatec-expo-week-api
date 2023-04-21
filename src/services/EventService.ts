import db from '../config/database/database';
import { Participacao } from '../models/Entities';
import { RequestGenerateCode, RequestValidateExhibit, RequestValidateLecture, ResponseEvent } from '../models/Event';

class EventService {

    static async list() {
        const conn = await db.connect();
        const events: ResponseEvent[] = await db.findMany(conn, 'SELECT * FROM vw_exibe_eventos');
        conn.end();
        return events;
    }

    static async generateCode(requestGenerateCode: RequestGenerateCode) {
        const { id_pessoa, id_evento } = requestGenerateCode;
        const conn = await db.connect();
        try {
            const isResponsable = await db.findFirst(
                conn,
                `SELECT id_pessoa, responsavel_evento FROM aluno WHERE responsavel_evento = ? AND id_pessoa = ?;`,
                [requestGenerateCode.id_evento, requestGenerateCode.id_pessoa]
            );

            if (isResponsable) {
                const evento: ResponseEvent = await db.findFirst(conn, 'SELECT * FROM evento WHERE tipo = ? AND id_evento = ?', ['palestra', id_evento]);

                if (!evento?.cod_verificacao) {
                    const random = Math.random().toString(36).slice(-8);
                    conn.query('UPDATE evento SET cod_verificacao = ?, id_pessoa_verificacao = ?, dt_verificacao = now() WHERE id_evento = ?;', [random, id_pessoa, id_evento]);
                    return { status: 200, message: random };
                } else {
                    return { status: 200, message: evento.cod_verificacao };
                }
            } else {
                return { status: 401, message: 'Você não é responsável por este evento.' };
            }
        } catch (error) {
            return error;
        } finally {
            conn.end();
        }
    }

    static async validateLecture(requestValidateLecture: RequestValidateLecture) {
        const conn = await db.connect();
        try {
            const minForNext = 180;
            const eventByValidateCode = await db.findFirst(
                conn,
                'SELECT id_evento FROM evento WHERE tipo = ? AND cod_verificacao = ?',
                ['palestra', requestValidateLecture.cod_validacao]
            );
            if (eventByValidateCode) {
                const participacao: Participacao = await db.findFirst(
                    conn,
                    'SELECT * FROM participacoes WHERE id_evento = ? AND id_pessoa_participante = ?;',
                    [eventByValidateCode.id_evento, requestValidateLecture.id_pessoa]
                );
                if (participacao?.data_validacao) {
                    return { status: 200, message: 'Sua presença já está confirmada para este evento.' };
                } else {
                    const inTime = await db.findFirst(
                        conn,
                        'CALL verifica_tempo(?)',
                        [eventByValidateCode.id_evento]
                    );
                    if (inTime[0]['@flag'] === 1) {
                        const isAllowed = await validationAllowed(conn, requestValidateLecture.id_pessoa, minForNext)
                            .then((success) => {
                                return success
                            });

                        if (isAllowed) {
                            await conn.query(
                                `INSERT INTO participacoes (id_evento, id_pessoa_participante, id_pessoa_validacao, data_validacao) 
                            VALUES (
                                ${eventByValidateCode.id_evento}, 
                                ${requestValidateLecture.id_pessoa}, 
                                ${requestValidateLecture.id_pessoa}, 
                                now());`
                            );
                            return { status: 200, message: 'Presença confirmada com sucesso.' }
                        }
                        return { status: 401, message: 'Você já confirmou presença em uma palestra neste período.' }
                    } else {
                        return { status: 401, message: 'Não foi possível confirmar a presença no evento, pois o período de validação acabou.' }
                    }
                }
            } else {
                return { status: 404, message: 'Não existe nenhum evento com este código de validação.' };
            }
        } catch (error) {
            return error;
        } finally {
            conn.end();
        }
    }

    static async validateExhibit(requestValidateExhibit: RequestValidateExhibit) {
        const conn = await db.connect();
        try {
            const minForNext = 15;
            const isResponsable = await db.findFirst(
                conn,
                `SELECT id_pessoa, responsavel_evento FROM aluno WHERE responsavel_evento = ? AND id_pessoa = ?;`,
                [requestValidateExhibit.id_evento, requestValidateExhibit.id_pessoa_validacao]
            );

            if (isResponsable) {
                const participation: Participacao = await db.findFirst(
                    conn,
                    'SELECT * FROM participacoes WHERE id_pessoa_participante = ? AND id_evento = ?;',
                    [requestValidateExhibit.id_pessoa_participante, requestValidateExhibit.id_evento]
                );
                if (participation) {
                    return { status: 404, message: 'Esta presença já está confirmada.' };
                }

                const isAllowed = await validationAllowed(conn, requestValidateExhibit.id_pessoa_participante, minForNext)
                    .then((success) => {
                        return success
                    });

                if (isAllowed) {
                    await conn.query(
                        `INSERT INTO participacoes (id_evento, id_pessoa_participante, id_pessoa_validacao, data_validacao) 
                    VALUES (
                        ${requestValidateExhibit.id_evento}, 
                        ${requestValidateExhibit.id_pessoa_participante}, 
                        ${requestValidateExhibit.id_pessoa_validacao}, 
                        now());`
                    );
                    return { status: 200, message: 'Presença confirmada com sucesso.' };
                } else {
                    return { status: 401, message: 'Não faz tanto tempo que essa pessoa assistiu a um evento, peça que retorne mais tarde!' }
                }
            } else {
                return { status: 401, message: 'Você não é responsável por este evento.' };
            }
        } catch (error) {
            return error;
        } finally {
            conn.end();
        }
    }

}

export default EventService;

async function validationAllowed(conn: any, participatedPersonId: number, minForNext: number): Promise<boolean> {
    const { minLastParticipation } = await db.findFirst(
        conn,
        `SELECT TIMESTAMPDIFF (
            MINUTE, ( SELECT data_validacao 
            FROM etecdeem_fatecweek.participacoes 
            WHERE id_pessoa_participante = ${participatedPersonId}
            ORDER BY data_validacao DESC LIMIT 1
            )
            + INTERVAL TIMESTAMPDIFF( HOUR, (
            SELECT data_validacao 
            FROM etecdeem_fatecweek.participacoes 
            WHERE id_pessoa_participante = ${participatedPersonId}
            ORDER BY data_validacao DESC 
            LIMIT 1
            ),
            (
             SELECT current_timestamp()
            )) HOUR, (SELECT current_timestamp() LIMIT 1)) AS minLastParticipation
            FROM participacoes LIMIT 1;`,
        []);

    if (minLastParticipation !== null && minLastParticipation <= minForNext) {
        return false;
    }
    return true;
}