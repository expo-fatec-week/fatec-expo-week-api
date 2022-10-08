import database from '../repository/connection.js';

async function findEvento() {
    const conn = await database.connect();
    const sql = 'select descricao, tipo from evento';
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

export default { findEvento }