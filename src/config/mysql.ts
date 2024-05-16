import dontenv from "dotenv";
import mysql from "mysql2/promise";
import {Signale} from "signale";

const signale = new Signale();
dontenv.config();

const config = {
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    waitForConnections:true,
    connectionLimit:10
}

const pool = mysql.createPool(config);

export async function query(sql:string,params:any[]) {
    try {
        const conn = await pool.getConnection();
        signale.success('Conexion a la base de datos exitosa');
        const result = await conn.execute(sql,params);
        conn.release();
        return result;
    }catch(error) {
        signale.error(error);
        return null;
    }
}