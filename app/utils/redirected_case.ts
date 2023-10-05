import { customLog } from "./customLog";

export enum REDIRECT_CASE {
    SESSION_TIMEOUT = "session_timeout",
    NO_PERMISSION   = "no_permission",
    PAGE_NOT_FOUND  = "page_not_found",
}

/**
 * @param redirectCase 
 * 
 * How to use in .tsx ?
 * {redirected_case && <div>{getRedirectMessage(getRedirectEnum(redirected_case))}</div>}
 * 
 * @returns redirectMassage : string
 */

export function getRedirectEnum(redirectCase: string | any): REDIRECT_CASE | null {
    customLog("redirectCase " + redirectCase);
    // redirectCaseが無い場合null
    if (typeof redirectCase !== 'string') return null;

    const matchedCase = Object.keys(REDIRECT_CASE).find(
        key => REDIRECT_CASE[key as keyof typeof REDIRECT_CASE] === redirectCase
    );
    if (matchedCase !== undefined) {
        return REDIRECT_CASE[matchedCase as keyof typeof REDIRECT_CASE];
    }
    return null;
}

export function getRedirectMessage(redirectCase: REDIRECT_CASE | null): string {
    switch (redirectCase) {
        case REDIRECT_CASE.SESSION_TIMEOUT:
            return "Message: Session Timeout!";
        case REDIRECT_CASE.NO_PERMISSION:
            return "Message: You do not have permission to view this page.";
        case REDIRECT_CASE.PAGE_NOT_FOUND:
            return "Message: The page you are looking for does not exist.";
        default:
            customLog("リダイレクトメッセージが不正な値です.");
            return "Message: Unknown reason.";
    }
}
