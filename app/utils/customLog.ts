
// デバッグのログレベルの定義
enum DEBUG_LOG_LEVEL {
    ALL_LOGS = 3,
    CUSTOM_LOGS = 2,
    OPERATION_LOGS = 1,
    NO_LOGS = 0
}

// カスタムログレベルの時,表示するログの種類選択
enum DEBUG_LOG_CATEGORY {
    ERROR,
    DATABASE,
    FUNCTION,
    DEBUG
}

let log_level : DEBUG_LOG_LEVEL;
let log_categories : String[];

// 環境変数で設定するべき項目
function setupDebugLevel() {
    // TODO : これらの環境変数化
    const env_log_level = "";
    const env_log_categories = "";
    log_level = DEBUG_LOG_LEVEL.ALL_LOGS;
    log_categories = [
        DEBUG_LOG_CATEGORY.ERROR.toString(),
        DEBUG_LOG_CATEGORY.DATABASE.toString(),
        DEBUG_LOG_CATEGORY.FUNCTION.toString(),
        DEBUG_LOG_CATEGORY.DEBUG.toString()
    ];
}

// ログ出力箇所のfunction名情報抽出
function getCallerInfo() {
    const stackList = (new Error()).stack!.split('\n').slice(3);
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;
    const s = stackList[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);
    if (sp && sp.length === 5) return `${sp[2]} (${sp[3]})`;
    return "No Caller Info";
}

/**
 * 開発用の専用ログです.ログ出力レベルを調整できます.  
 *　@param message ログ出力時の内容を記入します.
 * Object型に対応しました.
 */
export function customLog(message: any):void;
/**
 * 開発用の専用ログです.ログ出力レベルを調整できます.  
 * @param message ログ出力時の内容を記入します.
 * @param {string} category ログのカテゴリーを記入します.
 * カテゴリリストは以下になります.
 * - ERROR       : エラー発生時のログ,常に表示され,リリース後も必要
 * - DATABASE    : データベースアクセスに関するログ,リリース後,アクセスログを取る際に使用する可能性あり.
 * - FUNCTION    : Webサーバー固有のログ,リリース後はクライアント側で表示されるか注意する.
 * - DEBUG       : デバッグ用,リリース時は無視される.また,カテゴリー未入力の場合これに当たる.
 */
export function customLog(message: any, category: string):void;
export function customLog(message: any, category?: string):void {
    // カテゴリー未登録は,DEBUGとして出力
    if (!category) category = DEBUG_LOG_CATEGORY[DEBUG_LOG_CATEGORY.DEBUG];

    // ALL_LOGSの場合,全てのログを出力する.
    if (log_level == DEBUG_LOG_LEVEL.ALL_LOGS) {
    // NO_LOGSの場合,ログは出力しない.
    } else if (log_level == DEBUG_LOG_LEVEL.NO_LOGS) { return;
    // 出力ログリストにあるカテゴリーのみ出力する.
    } else if (log_categories.includes(category)) {
    // ログを出力せず終了
    } else { return;
    }

    // ログ出力部分
    try {
        if(typeof message == "object") {
            console.log(category + " " + getCallerInfo() + " : " + "Object");
            console.log(message);
        }else{
            console.log(category + " " + getCallerInfo() + " : " + message);
        }
    } catch (e) {
        console.log("Error : customLog.ts is bad function");
        console.log(e);
        return;
    }
}

setupDebugLevel();
