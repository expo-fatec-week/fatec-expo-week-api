import database from '../repository/connection.js';

async function findAluno(ra, email) {
  const conn = await database.connect();
  const sql = 'SELECT * FROM vw_aluno_info WHERE ra = ? AND email = ?';
  const dataAluno = [ra, email];
  const [rows] = await conn.query(sql, dataAluno);
  conn.end();
  return rows;
}
export default { findAluno }