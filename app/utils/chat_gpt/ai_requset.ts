
// 初期値を定義 : undefinedのものはJSON出力時に記入されない.
const value_model = "gpt-3.5-turbo";
const value_message = [{ role: "system", content: "You are a helpful assistant." }];
const value_max_tokens = 800;
const value_stop = undefined;
const value_n = undefined;
const value_user = undefined;
const value_seed = undefined;
const value_frequency_penalty = undefined;
const value_presence_penalty = undefined;
const value_temperature = undefined;
const value_top_p = undefined;
const value_logit_bias = undefined;
const value_logprobs = undefined;
const value_top_logprobs = undefined;
const value_stream = undefined;

/**
 * テキスト生成系AIに対してリクエストを送る場合のモデル
 * AIにリクエストを送るためのクラス
 */
export class AIRequest {
    /**
     * AIモデル
     * モデル名を選択します.
     * @type {string}
     * @memberof AIRequest
     * @default "gpt-3.5-turbo"
     */
    private _model?: string = value_model;

    /**
     * メッセージ
     * 配列で,会話履歴を定義します.
     * @type {{ role: string; content: string; }[]}
     * @memberof AIRequest
     * @default [{ role: "system", content: "You are a helpful assistant." }]
     * @example [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: "Hello!" }, { role: "assistant", content: "Hi there!" }, { role: "user", content: "How are you?" }]
     * roleにはsystem, user, assistantを指定します.
     */
    private _messages?: { role: string; content: string; }[] = value_message;

    /**
     * 最大トークン
     * @type {number}
     * @memberof AIRequest
     * @default 800
     * @range [0, Infinity]
     * 最大トークン数を指定します.
     * モデルによって最大値が異なります.
     * トークン数は,リクエスト,レスポンスの合計値としてカウントされます.
     */
    private _max_tokens?: number = value_max_tokens;

    /**
     * 終了条件設定
     * @type {string[]}
     * @memberof AIRequest
     * @default []
     * ストップ用の単語を指定します.最大で4つ指定できます.
     * @example ["\n", ".", "終わり"]
     */
    private _stop?: string[] = value_stop;

    /**
     * 回答数の指定
     * @type {number}
     * @memberof AIRequest
     * @default 1
     * @range [1, Infinity]
     * 回答数を指定します.
     * ただし増やせば増やすほど使用するトークンは増加します.
     */
    private _n?: number = value_n;

    /**
     * ユーザー定義
     * @type {string}
     * @memberof AIRequest
     * @default null
     * ユーザー名を指定します.
     * レスポンスに指定のユーザー名が記録されます.
     * デフォルトの場合,APIを叩いたセッションIDが返ってきます.
     */
    private _user?: string = value_user;

    /**
     * 乱数定義
     * @type {number}
     * @memberof AIRequest
     * @default null
     * @range [0, Infinity]
     * 乱数を指定します.
     * 乱数を指定すると,同じ回答を何度も行うことができます.
     * 乱数を指定しない場合は,生成するたびに別の回答を出力する可能性があります.
     * また,同じ乱数でもバックエンドのシステムやモデル更新によって回答が変化する可能性があります.
     */
    private _seed?: number = value_seed;

    /**
     * 頻度調整プロパティ
     * @type {number}
     * @memberof AIRequest
     * @default 0
     * @range [-2.0, 2.0]
     * テキスト中で1度でも使用されたトークンの再使用を増減させます.
     * -2.0 - 0 : 同じ回答を何度も行う可能性があります.
     * 0 - 1.0 : 同じ回答を控える傾向にあります.
     * 1.0 - 2.0 : 何度も同じ回答を行わない頻度が高くなります.ただし,品質が下がる可能性があります.
     */
    private _frequency_penalty?: number = value_frequency_penalty;

    /**
     * 存在調整プロパティ
     * @type {number}
     * @memberof AIRequest
     * @default 0
     * @range [-2.0, 2.0]
     * テキスト中でトークンが繰り返し使用されるたびに再使用の確率を増減させます.
     * -2.0 - 0 : 同じ回答を何度も行う可能性があります.
     * 0 - 1.0 : 同じ回答を控える傾向にあります.
     * 1.0 - 2.0 : 何度も同じ回答を行わない頻度が高くなります.では,品質が下がる可能性があります.
     */
    private _presence_penalty?: number = value_presence_penalty;

    /**
     * 次単語決定時の確率操作
     * @type {number}
     * @memberof AIRequest
     * @default 1
     * @range [0, 2.0]
     * 確率を指定します.
     * 0 - 1.0 : 高確率の単語の重みを強くして,低確率の単語の重みを弱くします.
     * 1.0 - 2.0 : 確率分布を平坦にして,確率の低いめな単語も採用される確率を上げます.
     */
    private _temperature?: number = value_temperature;

    /**
     * 次単語決定時の候補選別割合
     * @type {number}
     * @memberof AIRequest
     * @default 1
     * @range [0, 1.0]
     * 0.1 : 上位10%の候補のみを採用します.
     * 0.9 : 上位90%の候補のみを採用します.
     * 1.0 : すべての候補を採用します.
     */
    private _top_p?: number = value_top_p;

    /**
     * 特定トークン出現率変更プロパティ
     * @type {{ [key: string]: number }}
     * @memberof AIRequest
     * @default {}
     * 特定トークンの出現率を指定します.
     * @range [-100.0, 100.0]
     * -1.0 - 1.0 : トークンの選択確率を減少させるか増加させます.
     * -100.0 - 100.0 : トークンの選択を禁止するか,独占的に選択させる効果があります.
     */
    private _logit_bias?: {} = value_logit_bias;

    /**
     * 各選択トークンの出現確率を出力します.
     * @type {boolean}
     * @memberof AIRequest
     * @default false
     * true : 選択されたレスポンスに含まれる各トークンの選択確率を出力します.
     */
    private _logprobs?: boolean = value_logprobs;

    /**
     * トークン選択時の他候補を指定個数出力します.
     * @type {number}
     * @memberof AIRequest
     * @default null
     * logprobsをtrueに設定する必要があります.
     * @range [0, 5]
     * 0 : トークン選択時の他候補は出力されません.
     * 1 - 5 : トークン選択時の他候補を指定個数出力します.
     */
    private _top_logprobs?: boolean = value_top_logprobs;

    /**
     * ストリーム
     * @type {boolean}
     * @memberof AIRequest
     * @default false
     * true : ストリームを使用してレスポンスを返します.
     * false : ストリームを使用しない.
     */
    private _stream?: boolean = value_stream;

    get model(): string | undefined { return this._model; }
    set model(value: string | undefined) { this._model = value; }
    get messages(): { role: string; content: string; }[] | undefined { return this._messages; }
    set messages(value: { role: string; content: string; }[] | undefined) { this._messages = value; }
    add_messages(value: { role: string; content: string; }) { this._messages?.push(value); }
    get max_tokens(): number | undefined { return this._max_tokens; }
    set max_tokens(value: number | undefined) { this._max_tokens = value; }
    get stop(): string[] | undefined { return this._stop; }
    set stop(value: string[] | undefined) { this._stop = value; }
    get n(): number | undefined { return this._n; }
    set n(value: number | undefined) { this._n = value; }
    get user(): string | undefined { return this._user; }
    set user(value: string | undefined) { this._user = value; }
    get seed(): number | undefined { return this._seed; }
    set seed(value: number | undefined) { this._seed = value; }
    get frequency_penalty(): number | undefined { return this._frequency_penalty; }
    set frequency_penalty(value: number | undefined) { this._frequency_penalty = value; }
    get presence_penalty(): number | undefined { return this._presence_penalty; }
    set presence_penalty(value: number | undefined) { this._presence_penalty = value; }
    get temperature(): number | undefined { return this._temperature; }
    set temperature(value: number | undefined) { this._temperature = value; }
    get top_p(): number | undefined { return this._top_p; }
    set top_p(value: number | undefined) { this._top_p = value; }
    get logit_bias(): {} | undefined { return this._logit_bias; }
    set logit_bias(value: {} | undefined) { this._logit_bias = value; }
    get logprobs(): boolean | undefined { return this._logprobs; }
    set logprobs(value: boolean | undefined) { this._logprobs = value; }
    get top_logprobs(): boolean | undefined { return this._top_logprobs; }
    set top_logprobs(value: boolean | undefined) { this._top_logprobs = value; }
    get stream(): boolean | undefined { return this._stream; }
    set stream(value: boolean | undefined) { this._stream = value; }

    // このクラスのインスタンスをJSONに変換するメソッド
    toJSON(): string {
        return JSON.stringify({
            model: this._model,
            messages: this._messages,
            max_tokens: this._max_tokens,
            stop: this._stop,
            n: this._n,
            user: this._user,
            seed: this._seed,
            frequency_penalty: this._frequency_penalty,
            presence_penalty: this._presence_penalty,
            temperature: this._temperature,
            top_p: this._top_p,
            logit_bias: this._logit_bias,
            logprobs: this._logprobs,
            top_logprobs: this._top_logprobs,
            stream: this._stream
        });
    }
}