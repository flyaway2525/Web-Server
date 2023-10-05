
/**
 * userTokenProps
 * 概要 : ユーザーのトークンが持つ情報のモデル
 */

export type UserTokenPropsType = {
    sub : string | null; // Subject(主題,通常はユーザーID)
    iat : number | null; // Issued At(発行時刻)
    exp : number | null; // Expiration Time(有効期限)
    userId: string;
    userName: string;
    userRole: string;
};

export class UserTokenProps implements UserTokenPropsType {
    sub : string;
    iat : number;
    exp : number;
    userId: string;
    userName: string;
    userRole: string;

    constructor(userId: string, userName: string, userRole: string);
    constructor(TokenJson: string);

    constructor(userIdOrToken: string, userName?: string, userRole?: string) {
        // トークンが無い場合新規作成する.
        if (userName && userRole) {
            this.sub = "userIdSample";
            this.iat = Math.floor(Date.now() / 1000);
            this.exp = Math.floor(Date.now() / 1000) + 180; // TODO : 有効期限の環境変数化
            this.userId = userIdOrToken;
            this.userName = userName;
            this.userRole = userRole;
        // 既にトークンがある場合,そこからuserTokenPropsを作成する.
        } else {
            const obj = JSON.parse(userIdOrToken);
            this.sub = obj.sub;
            this.iat = obj.iat;
            this.exp = obj.exp;
            this.userId = obj.userId;
            this.userName = obj.userName;
            this.userRole = obj.userRole;
        }
    }

    toJson(): string {
        return JSON.stringify(this);
    }
}