import database from '../repository/connection.js';

async function findEvent(userId) {
    const conn = await database.connect();
    const sql = `SELECT a.id_evento, a.descricao, a.tipo, a.data_evento, c.nome, c.id_pessoa from evento a
	LEFT JOIN agenda b ON a.id_evento = b.id_evento
    LEFT JOIN pessoa c ON b.id_pessoa = c.id_pessoa
    WHERE data_evento > now() - interval 3 hour
    AND (dayofyear(data_evento) = dayofyear(now() - interval 3 hour))
    AND a.id_evento not in(select b.id_evento from agenda where b.id_pessoa = ?);`;
    const [rows] = await conn.query(sql, userId);
    conn.end();
    return rows;
}

async function generateCodeValidation(id_pessoa, id_evento) {
    const conn = await database.connect();
    const [evento] = await conn.query(`SELECT * FROM evento WHERE id_evento = ${id_evento};`);
    if (!evento[0].cod_verificacao) {
        const random = Math.random().toString(36).slice(-8).toUpperCase();
        const updateEvent = [random, id_pessoa, id_evento];
        await conn.query(
            'UPDATE evento SET cod_verificacao = ?, id_pessoa_verificacao = ?, dt_verificacao = now() WHERE id_evento = ?;', updateEvent
        );
        conn.end();
        return random;
    } else {
        conn.end();
        return evento[0].cod_verificacao;
    }
}

async function confirmPresence(id_pessoa, id_evento, cod_validacao) {
    const conn = await database.connect();
    const [evento] = await conn.query(`SELECT * FROM evento WHERE id_evento = ${id_evento};`);
    const [agenda] = await conn.query(`SELECT * FROM agenda WHERE id_evento = ${id_evento} AND id_pessoa = ${id_pessoa};`);
    const [inTime] = await conn.query(`CALL verifica_tempo(${id_evento})`);
    conn.end();

    if (agenda.length === 0) return 'Você não se inscreveu nesse evento.';
    if (agenda[0].validacao === 1) return 'Sua presença já está confirmada.';
    if (evento[0].cod_verificacao !== cod_validacao) return 'Código de validação não confere com o código gerado para o evento.';
    if (inTime[0][0]['@flag'] === 0) return 'Não foi possível confirmar a presença no evento, pois o período de validação acabou.';

    const newConn = await database.connect();
    const updateEvent = [1, id_pessoa, id_evento, id_pessoa];
    await newConn.query(
        'update agenda set validacao = ?, quem_validou = ?, data_hora = now() where id_evento = ? and id_pessoa = ?;', updateEvent
    );
    newConn.end();
    return 'Presença confirmada com sucesso.';
}

export default { findEvent, generateCodeValidation, confirmPresence };
