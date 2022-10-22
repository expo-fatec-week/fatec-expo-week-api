import database from '../repository/connection.js';

async function findEventCheckout(eventId) {
  const conn = await database.connect();
  const sql = 'SELECT * FROM vw_valida_estande WHERE id_evento = ? AND validacao = 0';
  const dataEvent = [eventId];
  const [rows] = await conn.query(sql, dataEvent);
  conn.end();
  return rows;
}

async function confirmEventCheckout(code, idPerson) {
  const conn = await database.connect();
  const sql = `UPDATE agenda SET validacao = 1, data_hora = now(), quem_validou = 'teste' WHERE id_evento = ? AND id_pessoa = ?`;
  const dataConfirm = [code, idPerson];
  await conn.query(sql, dataConfirm);
  conn.end();
}

export default { findEventCheckout, confirmEventCheckout }