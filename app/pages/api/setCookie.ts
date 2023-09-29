import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    // トークンの値をリクエストボディから取得
    const token = req.body.token;
    if (token) {
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/;`);
        res.status(200).send({ message: 'Cookie set' });
    } else {
        res.status(400).send({ message: 'Token not provided' });
    }
};
