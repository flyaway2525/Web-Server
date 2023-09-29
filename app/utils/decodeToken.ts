import jwt from 'jsonwebtoken';

export function decodeToken(token: string) {
    try {
        return jwt.decode(token);
    } catch (e) {
        console.log("Error : decodeToken.ts");
        console.log(e);
        return null;
    }
}
