import database from '../repository/connection.js';

async function setAgenda(idEvento, idPessoa, validacao) {
    const conn = await database.connect();
    const sql = 'insert into agenda(id_evento, id_pessoa, validacao, dtcria) values(?, ?, ?, now());';
    const dataAgenda = [idEvento, idPessoa, validacao];
    await conn.query(sql, dataAgenda);
    conn.end();
}
async function upAgenda(idEvento, idPessoa, validacao, qmValidou, dataHora) {
    const conn = await database.connect();
    const sql = 'update agenda set validacao = ?, quem_validou = ?, data_hora = now() where id_evento = ? and id_pessoa = ?;';
    const data_upAgenda = [validacao, qmValidou, dataHora, idEvento, idPessoa];
    await conn.querry(sql, data_upAgenda);
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
export default { setAgenda, upAgenda, selectAgenda }