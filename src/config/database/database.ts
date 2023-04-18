import mysql from 'mysql2/promise';

async function connect() {
    return await mysql.createConnection(process.env.DATABASE_URL ?? '');
}

async function findFirst(conn: mysql.Connection, sql: string, values: Array<any>): Promise<any> {
    const [rows] = await conn.query(sql, values);
    let rs: any;
    if (rows instanceof Array) {
        rs = rows[0];
    }
    return rs;
}

async function findMany(conn: mysql.Connection, sql: string, values?: Array<any>): Promise<any> {
    const [rows] = await conn.query(sql, values);
    return rows;
}

async function executeQuery(conn: mysql.Connection, sql: string, values?: Array<any>): Promise<any> {
    return await conn.query(sql, values);
}

export default { connect, findFirst, findMany, executeQuery };