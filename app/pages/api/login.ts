import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import * as mysql from 'promise-mysql';
import bcrypt from 'bcryptjs';
import { customLog } from '../../utils/customLog';
import { UserTokenProps } from '../../utils/userTokenProps';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // データベースからユーザを取得するロジックを実装します。
    const connection = await mysql.createConnection({
      // 接続テスト用,本来ここに直接パスワードを書いたりはダメ
      host: 'db',
      user: 'root',
      port: 3306,
      password: 'password',
      database: 'chat_app_db'
    });
    const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    const userinfo = (await connection.query(query, [req.body.username]))[0];
    await connection.end();

    // ユーザーの存在確認
    if(!userinfo) {
      customLog("401 user not found");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // パスワードの確認
    const passwordCheck : Boolean = await bcrypt.compare(req.body.password, userinfo.password);
    if(!passwordCheck) {
      customLog("401 password incorrect");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 認証成功,ユーザーのトークンに入れる情報作成
    const tokenPayload: UserTokenProps = new UserTokenProps(userinfo.id,userinfo.username,"USER_ROLE");
    // トークン発行
    const token = jwt.sign(tokenPayload.toJson(), '', { algorithm: 'none' }); // 署名なしのJWT ※TODO : 署名入りトークンの作成
    res.status(200).json({ token: token });
  } else {
    customLog("405 Server Error");
    res.status(405).end();
  }
};
