import database from '../repository/connection.js';

async function setAgenda(idEvento, idPessoa, validacao){
    const conn = await database.connect();
    const sql = 'insert into agenda(id_evento, id_pessoa, validacao, dtcria) values(?, ?, ?, ?, now());';
    const dataAgenda = [idEvento, idPessoa, validacao];
    await conn.query(sql, dataAgenda);
}


export default {setAgenda}