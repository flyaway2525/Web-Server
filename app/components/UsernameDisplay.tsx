import React from 'react';
// decodeTokenをインポート
import { decodeToken } from '../utils/decodeToken';

type UsernameDisplayProps = {
    token: string | null;
};

const UsernameDisplay: React.FC<UsernameDisplayProps> = ({ token }) => {
    console.log("token");
    console.log(token);
    // トークンをデコードしてユーザー情報を取得
    const decoded : any = token ? decodeToken(token) : null;
    console.log("decoded");
    console.log(decoded);
    const username = decoded?.username || 'ゲスト';

    return <span>{username}さん</span>;
};

export default UsernameDisplay;
