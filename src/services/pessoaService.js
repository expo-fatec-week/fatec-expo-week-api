import database from '../repository/connection.js';

async function findPessoa() {
  const conn = await database.connect(); //iniciando a conexão com o banco
  const sql = 'SELECT * FROM pessoa';
  const [rows] = await conn.query(sql);
  /*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
  | executando o comando SQL     |
  | e pegando apenas as informa̲  |
  | ções das 'rows'.             |
  \_____________________________*/

  conn.end(); //finalizando a conexão com o banco
  return rows;
}
async function newPessoa(name, email, tel, ra, cpf, curso, periodo) {
  const conn = await database.connect(); //começando a conexão
  const sql = 'call insPAV(?, ?, ?, ?, ?, ?, ?)';
  const dataPessoa = [name, email, tel, ra, cpf, curso, periodo]; //recebendo da variável do front

  await conn.query(sql, dataPessoa);
  /*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
  | executando o comando SQL     |
  | concatenando o comando SQL   |
  | junto as variáveis recebidas |
  | no front.                    |
  \_____________________________*/

  conn.end(); //finalizando a conexão com o banco
}

async function findSpecificPerson(cpf) {
  const conn = await database.connect(); 
  const sql = 'SELECT * FROM vw_visitante_info WHERE cpf = ? ';
  const [rows] = await conn.query(sql, cpf);
  conn.end(); 
  return rows;
}

export default { findPessoa, newPessoa, findSpecificPerson }


/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
| é preciso atualizar este     | 
| service, pois existem        |
| funcionalidades que serão    |
| alteradas                    |
\_____________________________*/
