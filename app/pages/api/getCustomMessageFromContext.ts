import { NextApiRequest, NextApiResponse } from 'next';
import { customLog } from '@/utils/customLog';
import { AIRequest } from '@/utils/chat_gpt/ai_requset';
import { Messages } from '@/utils/chat_gpt/messages';

const API_KEY: string = process.env.AZURE_AI_API_KEY_CHATGPT35!;
const AZURE_AI_SERVER_URL: string = process.env.AZURE_AI_SERVER_URL!;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    customLog(req.body,"DEBUG");
    const requestMessages: Messages = new Messages(req.body);

    if(requestMessages && requestMessages.get_length() === 0){
      customLog("requestMessage is empty","DEBUG");
      return res.status(200).json({ success: false, message: "request message is empty" });
    }

    let data: any;
    const headers = new Headers();
    headers.append("api-key", API_KEY);
    headers.append("Content-Type", "application/json");
    const ai_request = new AIRequest();
    ai_request.model = "gpt-3.5-turbo";
    customLog(requestMessages,"DEBUG");
    ai_request.messages = requestMessages.toJSON();

    const body = ai_request.toJSON();
    customLog(body,"DEBUG");

    let requestOptions = {
      method: "POST",
      headers: headers,
      body: body
    };

    let response: any = undefined;
    try {
      customLog(requestOptions,"DEBUG");
      response = await fetch(AZURE_AI_SERVER_URL, requestOptions);
    }catch(e){
      console.log("Error : getCustomMessageFromChatGPT.ts is bad function");
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
      customLog(response,"DEBUG");
      customLog('Network response was not ok',"FUNCTION");
    }
    return res.status(200).json({ success: false, message: "API response was not ok" });
  }
};
