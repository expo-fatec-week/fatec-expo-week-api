import database from '../repository/connection.js';

async function findEvento() {
    const conn = await database.connect();
    const sql = 'select * from vw_exibe_eventos';
    const [rows] = await conn.query(sql);
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
    const [agenda] = await conn.query(`SELECT * FROM agenda WHERE id_evento = ${id_evento};`);
    if (agenda.length > 0 && evento[0].cod_verificacao === cod_validacao) {
        const updateEvent = [1, id_pessoa, id_evento, id_pessoa];
        await conn.query(
            'update agenda set validacao = ?, quem_validou = ?, data_hora = now() where id_evento = ? and id_pessoa = ?;', updateEvent
        );
    }
    if (agenda.length === 0) return 'Você não se inscreveu nesse evento.';
    if (agenda[0].validacao === 1) return 'Sua presença já esta confirmada.';
    if (evento[0].cod_verificacao !== cod_validacao) return 'Código de validação não confere com o código gerado para o evento.';
    conn.end();
    return 'Presença confirmada com sucesso.';
}

export default { findEvento, generateCodeValidation, confirmPresence }