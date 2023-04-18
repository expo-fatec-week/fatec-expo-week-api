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

    static async validadeLecture(requestValidateLecture: RequestValidateLecture) {
        const conn = await db.connect();
        try {
            const codValidacaoEvento: string = await db.findFirst(conn, 'SELECT cod_validacao FROM evento WHERE id_evento = ?;', [requestValidateLecture.id_evento]);
            const participacao: Participacao = await db.findFirst(conn, 'SELECT * FROM participacoes WHERE id_evento = ? AND id_pessoa_participante = ?;', [requestValidateLecture.id_evento, requestValidateLecture.id_pessoa])
            const inTime = await db.findFirst(conn, 'CALL verifica_tempo(?)', [requestValidateLecture.id_evento]);

            if (participacao.data_validacao) return 'Sua presença já está confirmada.';
            if (codValidacaoEvento !== requestValidateLecture.cod_validacao) return 'Código de validação não confere com o código gerado para o evento.';
            if (inTime[0]['@flag'] === 0) return 'Não foi possível confirmar a presença no evento, pois o período de validação acabou.';

            await conn.query(
                `INSERT INTO participacoes (id_evento, id_pessoa_participante, id_pessoa_validacao, data_validacao) 
                VALUES (
                    id_evento: ${requestValidateLecture.id_evento}, 
                    id_pessoa_participante: ${requestValidateLecture.id_pessoa}, 
                    id_pessoa_validacao: ${requestValidateLecture.id_pessoa}, 
                    now());`
            );
            return 'Presença confirmada com sucesso.';
        } catch (error) {
            return error;
        } finally {
            conn.end();
        }
    }

    static async validadeExhibit(requestValidateExhibit: RequestValidateExhibit) {
        const conn = await db.connect();
        try {
            const minForNext = 15;
            const participations: Participacao[] = await db.findMany(conn, 'SELECT * FROM participacoes WHERE id_pessoa_participante = ? ORDER BY data_validacao DESC;', [requestValidateExhibit.id_pessoa_participante])

            if (participations) {
                participations.forEach((participation) => {
                    if (participation.id_evento === requestValidateExhibit.id_evento) {
                        return 'Sua presença já está confirmada.';
                    }
                })

                const inTime: number = await db.executeQuery(conn, 'select * FROM vw_time_difference_last_event;');

                if (inTime < minForNext) {
                    return 'Não faz tanto tempo que essa pessoa assistiu a um evento, peça que retorne mais tarde!';
                }
            }

            await conn.query(
                `INSERT INTO participacoes (id_evento, id_pessoa_participante, id_pessoa_validacao, data_validacao) 
                VALUES (
                    id_evento: ${requestValidateExhibit.id_evento}, 
                    id_pessoa_participante: ${requestValidateExhibit.id_pessoa_participante}, 
                    id_pessoa_validacao: ${requestValidateExhibit.id_pessoa_validacao}, 
                    now());`
            );
            return 'Presença confirmada com sucesso.';
        } catch (error) {
            return error;
        } finally {
            conn.end();
        }
    }

}

export default EventService;