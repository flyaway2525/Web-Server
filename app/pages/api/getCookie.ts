import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    // クッキーが存在するか確認
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(404).send({ message: 'No cookies found' });
    }
    // トークンを取得
    const tokenEntry = cookies.split(';').find(c => c.trim().startsWith('token='));
    if (!tokenEntry) {
        return res.status(404).send({ message: 'Token not found' });
    }
    // "token=VALUE" の "VALUE" を取得
    const tokenValue = tokenEntry.split('=')[1];

    res.status(200).send({ token: tokenValue });
};
