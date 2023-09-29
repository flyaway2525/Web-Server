import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import * as mysql from 'promise-mysql';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // パスワードフォーマットチェック※TODO : 条件の実装
    if(req.body.password == "") {
      return res.status(200).json({ success: false, message: "password format incorrect" });
    }

    const connection = await mysql.createConnection({
      // 接続テスト用,本来ここに直接パスワードを書いたりはダメ
      host: 'db', // どこからとってくるのかは不明,コンテナサービス名らしいが...？
      user: 'root',
      port: 3306,
      password: 'password',
      database: 'chat_app_db'
    });

    // ユーザー名のチェック
    const query_user_name = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    const exist_user : User = (await connection.query(query_user_name, [req.body.username]))[0];
    if(exist_user) {
      console.log("signup.ts username already exist : ");
      console.log(exist_user);
      await connection.end();
      return res.status(200).json({ success: false, message: "username already exist" });
    }

    // メールアドレスのチェック
    const query_email = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const exist_email : User = (await connection.query(query_email, [req.body.email]))[0];
    if(exist_email) {
      console.log("signup.ts email already exist : ");
      console.log(exist_email);
      await connection.end();
      return res.status(200).json({ success: false, message: "username already exist" });
    }

    // ユーザー登録
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const data = await connection.query(query, [req.body.username, req.body.email, hashedPassword]);
    console.log("signup.ts User Signup : " + data);
    await connection.end();
    return res.status(200).json({ success: true });
  } else {
    return res.status(405).end();
  }
};
