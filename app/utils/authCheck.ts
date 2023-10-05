import { GetServerSidePropsContext } from "next";
import jwt from 'jsonwebtoken';
import { customLog } from "./customLog";
import { UserTokenProps } from "./userTokenProps";
import { REDIRECT_CASE } from "./redirected_case";

export const authCheck = async (context: GetServerSidePropsContext) => {
    const token = context.req.cookies.token;
  
    // トークンが存在しない場合
    if (!token) return redirect_login;
    try {
        // ここでトークンの検証を行う
        // TODO : 秘密鍵によるトークン検証
        // const secretKey = 'yourSecretKey'; // 署名に使用した秘密鍵
        // const decoded = jwt.verify(token, secretKey);

        // トークンのデコード
        const decoded: any = jwt.decode(token);
        const userProps: UserTokenProps = new UserTokenProps(JSON.stringify(decoded));
        // ユーザーIDのチェック
        if (!decoded || !userProps.userId) {
            customLog("redirect with UserID failed");
            return redirect_login;
        }

        // 有効期限のチェック
        console.log("decoded.exp" + decoded.exp);
        if (!decoded.exp || decoded.exp <= Math.floor(Date.now() / 1000)) {
            customLog("redirect with Expiration Date failed");
            return redirect_login;
        }

        // 認証済の場合
        return {
            props: {
                userinfo: JSON.parse(userProps.toJson())
            }
        };
    } catch (e: any) {
        customLog(e.message);
    }
    return redirect_login;
};

const redirect_login = {
    redirect: {
        destination: '/login?redirect_case=session_timeout',
        permanent: false,
    },
}
