import database from '../repository/connection.js';

async function findAluno(ra) {
  const conn = await database.connect();
  const sql = 'SELECT * FROM vw_aluno_info WHERE ra = ?';
  const dataAluno = [ra];
  const [rows] = await conn.query(sql, dataAluno);
  conn.end();
  return rows;
}
export default { findAluno }