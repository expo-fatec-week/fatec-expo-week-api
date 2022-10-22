import database from '../repository/connection.js';

async function findEvent(userId) {
    const conn = await database.connect();
    const sql = 'select * from vw_eventos_disponiveis';
    const [rows] = await conn.query(sql, userId);
    conn.end();
    return rows;
}

export default { findEvent }