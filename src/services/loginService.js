import database from '../repository/connection.js';

async function login(userName, password) {
  const conn = await database.connect();

  const sql = 'SELECT * FROM login WHERE id_login = ? AND senha = ?;';
  const dataLogin = [userName, password];
  const [rows] = await conn.query(sql, dataLogin);
  conn.end();
  return rows;
}

export default { login }