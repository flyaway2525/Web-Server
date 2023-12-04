import { NextApiRequest, NextApiResponse } from 'next';
import { customLog } from '@/utils/customLog';

const API_KEY: string = process.env.AZURE_AI_API_KEY_CHATGPT35!;
const AZURE_AI_SERVER_URL: string = process.env.AZURE_AI_SERVER_URL!;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    customLog(req.body,"DEBUG");
    const requestMessage: string = req.body.message;

    if(requestMessage == "") {
      customLog("requestMessage is empty","DEBUG");
      return res.status(200).json({ success: false, message: "request message is empty" });
    }

    // OpenAIのレスポンスのJSON型,適切な型リストが見つかり次第実装予定
    let data: any;
    const headers = new Headers();
    headers.append("api-key", API_KEY);
    headers.append("Content-Type", "application/json");

    const customRequestMessage: string =
    `
      あなたの3通りの回答をJson形式で1つだけ行う.
      注釈等を行う場合,commentに記入する.
      1. 適切な回答
      正解がわかる内容は,その通りに回答する.
      例 : 
      {"type":"answer","message":"ここに回答が入る.","comment":"注釈等"}
      2. DBにアクセスすべきかの判断
      足りない情報を取得するために,DBへのアクセスを要求できる.
      要求するために,テーブル名になりえる候補,必要なカラム名の候補を配列で出力する.
      例 : 
      {"type":"db_info","message":[Users,Members,id,user_id],"comment":"注釈等"}
      カラム名は大文字で始まります.
      3. DBにアクセスするSQL文
      DBから任意の情報を取得するためにSQL文を要求できる.
      例 : 
      {"type":"sql","message":"SELECT * from users","comment":"注釈等"}
    ` + requestMessage;
    const body = JSON.stringify({
      "messages": [
        {
        "role": "system",
        "content": customRequestMessage
        }
      ],
      "temperature": 0.7,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0,
      "max_tokens": 800,
      "stop": null
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: body
    };

    let response: any = undefined;
    try {
      response = await fetch(AZURE_AI_SERVER_URL, requestOptions);
    }catch(e){
      console.log("Error : getMessageFromDBConnectionAI.ts is bad function");
      console.log(e);
    }
    let responseMessage: string = "";
    if (response.ok) {
      data = await response.json();
      responseMessage = data.choices[0].message.content;
      if(responseMessage != ""){
        customLog(data.choices[0].message,"DEBUG");
        return res.status(200).json({ success: true, message: responseMessage });
      } else {
        customLog('response message is empty',"FUNCTION");
      }
    } else {
      customLog('Network response was not ok',"FUNCTION");
    }
    return res.status(200).json({ success: false, message: "API response was not ok" });
  }
};
