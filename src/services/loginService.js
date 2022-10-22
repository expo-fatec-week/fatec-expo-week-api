import database from '../repository/connection.js';

async function login(user, password) {
  const conn = await database.connect();

  const sql = 'SELECT * FROM login WHERE usuario = ? AND senha = ?;';
  const dataLogin = [user, password];
  const [rows] = await conn.query(sql, dataLogin);
  conn.end();
  return rows;
}

export default { login }