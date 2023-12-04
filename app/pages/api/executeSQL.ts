// server/app/pages/api/executeSQL.ts

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import * as mysql from 'promise-mysql';
import bcrypt from 'bcryptjs';
import { customLog } from '../../utils/customLog';
import { UserTokenProps } from '../../utils/userTokenProps';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_ACCESS_TEST_HOST,
      user: process.env.DATABASE_ACCESS_TEST_USER,
      port: Number(process.env.DATABASE_ACCESS_TEST_PORT),
      password: process.env.DATABASE_ACCESS_TEST_PASSWORD,
      database: process.env.DATABASE_ACCESS_TEST_DATABASE_NAME_FOR_API_TEST
    });
    const query = req.body.sql;
    let sql_response;
    let sql_error = undefined;
    try{
      customLog("SQL : ","DEBUG");
      customLog(query,"DEBUG");
      sql_response = (await connection.query(query));
      customLog("SQL_RESPONSE : ","DEBUG");
      customLog(sql_response,"DEBUG");
    }catch (e){
      sql_error = e;
      customLog("SQL_ERROR","DATABASE");
      customLog(e,"DATABASE");
    }finally{
      await connection.end();
    }

    // SQLの存在確認
    if(!query) {
      customLog("401 sql not found");
      return res.status(401).json({ error: 'sql not found' });
    }

    // Responseの存在確認
    if(sql_error) {
      customLog("401 sql error");
      return res.status(401).json({ error: 'SQL error' });
    }
    res.status(200).json(JSON.stringify(sql_response));
  } else {
    customLog("405 Server Error");
    res.status(405).end();
  }
};
