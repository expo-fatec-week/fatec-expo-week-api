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
            const evento: ResponseEvent = await db.findFirst(conn, 'SELECT * FROM evento WHERE id_evento = ?', [id_evento]);

            if (!evento?.cod_verificacao) {
                const random = Math.random().toString(36).slice(-8).toUpperCase();
                conn.query('UPDATE evento SET cod_verificacao = ?, id_pessoa_verificacao = ?, dt_verificacao = now() WHERE id_evento = ?;', [random, id_pessoa, id_evento]);
                return random;
            } else {
                return evento.cod_verificacao;
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
            const codValidacaoEvento: string = await db.findFirst(
                conn,
                'SELECT cod_validacao FROM evento WHERE id_evento = ?;',
                [requestValidateLecture.id_evento]
            );
            const participacao: Participacao = await db.findFirst(
                conn,
                'SELECT * FROM participacoes WHERE id_evento = ? AND id_pessoa_participante = ?;',
                [requestValidateLecture.id_evento, requestValidateLecture.id_pessoa]
            );
            const inTime = await db.findFirst(
                conn,
                'CALL verifica_tempo(?)',
                [requestValidateLecture.id_evento]
            );

            if (participacao.data_validacao) return { status: 200, message: 'Sua presença já está confirmada.' };
            if (codValidacaoEvento !== requestValidateLecture.cod_validacao) return { status: 401, message: 'Código de validação não confere com o código gerado para o evento.' };
            if (inTime[0]['@flag'] === 0) return { status: 401, message: 'Não foi possível confirmar a presença no evento, pois o período de validação acabou.' };

            await conn.query(
                `INSERT INTO participacoes (id_evento, id_pessoa_participante, id_pessoa_validacao, data_validacao) 
                VALUES (
                    id_evento: ${requestValidateLecture.id_evento}, 
                    id_pessoa_participante: ${requestValidateLecture.id_pessoa}, 
                    id_pessoa_validacao: ${requestValidateLecture.id_pessoa}, 
                    now());`
            );
            return { status: 200, message: 'Presença confirmada com sucesso.' }
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
            const participation: Participacao = await db.findFirst(
                conn,
                'SELECT * FROM participacoes WHERE id_pessoa_participante = ? AND id_evento = ?;',
                [requestValidateExhibit.id_pessoa_participante, requestValidateExhibit.id_evento]
            );

            if (isResponsable) {
                if (participation) {
                    return { status: 200, message: 'Sua presença já está confirmada.' };
                }
                const { minLastParticipation } = await db.findFirst(
                    conn,
                    `SELECT TIMESTAMPDIFF (
                        MINUTE, ( SELECT data_validacao 
                        FROM etecdeem_fatecweek.participacoes 
                        WHERE id_pessoa_participante = ${requestValidateExhibit.id_pessoa_participante}
                        ORDER BY data_validacao DESC LIMIT 1
                        )
                        + INTERVAL TIMESTAMPDIFF( HOUR, (
                        SELECT data_validacao 
                        FROM etecdeem_fatecweek.participacoes 
                        WHERE id_pessoa_participante = ${requestValidateExhibit.id_pessoa_participante}
                        ORDER BY data_validacao DESC 
                        LIMIT 1
                        ),
                        (
                         SELECT current_timestamp()
                        )) HOUR, (SELECT current_timestamp() LIMIT 1)) AS minLastParticipation
                        FROM participacoes LIMIT 1;`,
                    []);
                if (minLastParticipation !== null && minLastParticipation <= minForNext) {
                    return { status: 401, message: 'Não faz tanto tempo que essa pessoa assistiu a um evento, peça que retorne mais tarde!' }
                } else {
                    await conn.query(
                        `INSERT INTO participacoes (id_evento, id_pessoa_participante, id_pessoa_validacao, data_validacao) 
                    VALUES (
                        ${requestValidateExhibit.id_evento}, 
                        ${requestValidateExhibit.id_pessoa_participante}, 
                        ${requestValidateExhibit.id_pessoa_validacao}, 
                        now());`
                    );
                    return { status: 200, message: 'Presença confirmada com sucesso.' };
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