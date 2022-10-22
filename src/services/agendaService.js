import database from '../repository/connection.js';

async function setAgenda(eventId, userId, validacao) {
    const conn = await database.connect();
    const sql = 'insert into agenda(id_evento, id_pessoa, validacao, dtcria) values(?, ?, ?, now());';
    const dataAgenda = [eventId, userId, validacao];
    await conn.query(sql, dataAgenda);
    conn.end();
}

async function upAgenda(idEvento, idPessoa, validacao, qmValidou, dataHora) {
    const conn = await database.connect();
    const sql = 'update agenda set validacao = ?, quem_validou = ?, data_hora = now() where id_evento = ? and id_pessoa = ?;';
    const data_upAgenda = [validacao, qmValidou, dataHora, idEvento, idPessoa];
    await conn.query(sql, data_upAgenda);
    conn.end();
}

async function selectAgenda(idPessoa) {
    const conn = await database.connect();
    const sql = 'select max(data_hora) dataHora from agenda where id_pessoa = ?;';
    const data_upAgenda = [idPessoa];
    const [rows] = await conn.query(sql, data_upAgenda);
    conn.end();
    return [rows]
}

async function findEvent(userId) {
    const conn = await database.connect();
    const sql = `select * from vw_meus_eventos where id_pessoa = ?`;
    const [rows] = await conn.query(sql, userId);
    conn.end();
    return rows;
}

export default { setAgenda, upAgenda, selectAgenda, findEvent }