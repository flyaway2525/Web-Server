import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from '@chatscope/chat-ui-kit-react';
import { v4 as uuidv4 } from 'uuid';
import { customLog } from '@/utils/customLog';

// ページコンポーネント
function ChatWithAiTest() {
  // メッセージのstateを作成
  const [messages, setMessages] = useState<Array<ExtendMessageModel>>([
    {
      id: uuidv4(),
      message: "初期入力メッセージ",
      sentTime: "just now",
      sender: "Bot",
      direction: "outgoing",
      position: "single"
    }
  ]);
  const [database_info, setDatabase_info] = useState<SqlModel>({
    sql: "sql sample",
    sql_result: "sql result sample"
  });

  // メッセージの送信機能の追加
  const handleSendMessage = async (messageText:string) => {
    // サーバーに送信されたメッセージをmessagesに反映する.
    const newMessage: ExtendMessageModel = {
      id: uuidv4(),
      message: messageText,
      sentTime: "just now",
      sender: "User",
      direction: "incoming",
      position: "single"
    };
    // sql文に関しては,常に最新のものだけ表示する.
    setMessages(prevMessages => [...prevMessages, newMessage]);
    const newSql: SqlModel = {
      sql: "",
      sql_result: ""
    };
    setDatabase_info(newSql);

    // AIによる返答を作成する.
    try {
      let answerType: string = "answer";
      let answerText: string = messageText;
      let answerTryLimit: number = 5;
      let replyMessageText: string = "";
      do {
        replyMessageText = await fetchData(answerText);
        const answer:AnswerModel = await JSON.parse(replyMessageText);
        customLog(answer.type);
        if(answer.type == "answer"){
          answerText = answer.message;
          customLog("ANSWERを通ったよ","DEBUG");
        }else if(answer.type == "db_info"){
          customLog("DB_INFOを通ったよ","DEBUG");
          customLog(answerText,"DEBUG");
          answerText = messageText + "\nテーブル,カラムの候補は[" + answer.message + "]";
        }else if(answer.type == "sql"){
          customLog("SQLを通ったよ","DEBUG");
          customLog(answerText,"DATABASE");


          const data = "di:31";
          //const data = await getDatabaseResource(answer.message);

          let response;
          try {
            const execute_sql_api_response : Response = await fetch('/api/executeSQL', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ "sql": answer.message }),
            });
            if(execute_sql_api_response.ok){
              response = await execute_sql_api_response.json();
            }
          }catch(e){
            console.log("access_database_with_ai_test.tsx ERROR");
            console.log(e);
          }finally{
            if(response){
              setDatabase_info({
                sql: answer.message,
                sql_result: response
              });
            }
          }

          answerText = messageText + "\n調査結果[" + response + "]"; // Databaseに接続してSQLを実行した,と仮定する.
        }else {
          customLog("何も通らなかったよ","DEBUG");
          customLog(answerText,"DEBUG");
        }
        answerType = answer.type;
        answerTryLimit--;
        customLog("answer.type    : " + answer.type,"DEBUG");
        customLog("answerTryLimit : " + answerTryLimit,"DEBUG");
      } while (answerType != "answer" && 0<=answerTryLimit)

      const replyMessage: ExtendMessageModel = {
        id: uuidv4(),
        message: answerText,
        sentTime: "just now",
        sender: "Bot",
        direction: "outgoing",
        position: "single"
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    } catch (error) {
      console.error('Error while sending message:', error);
    }
  };

  // Pageコンポーネント
  return (
    <div>
      <h1>Interaction with ChatGPT 3.5</h1>
        <div style={{ position: "relative", height: "500px" }}>
          <MainContainer style={{display: 'flex'}}>
            <ChatContainer>
              <MessageList>
                {messages.map(msg => (
                  <Message key={msg.id} model={msg} />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={(value: string) => handleSendMessage(value)}
              />
            </ChatContainer>
            <div style={{order:1,width:400}}>
              <h2>指定されたSQL文</h2>
              <h5>{database_info?.sql}</h5>
              <h2>SQL実行結果</h2>
              <h5>{database_info?.sql_result}</h5>
            </div>
          </MainContainer>
        </div>
      </div>
  );
}

// APIを叩いてレスポンスを受ける.
async function fetchData(context:string): Promise<string> {
  let data: any = undefined;
  try{
    data = await fetch('/api/getMessageFromDBConnectionAI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: context }),
    });
  }catch(e){
    console.log("Error : access_database_with_ai_test.tsx is bad function");
    console.log(e);
    return "API接続エラーです.";
  }
  if (data.ok) {
    const response = await data.json();
    if(response.success) {
      return response.message;
    } else {
      customLog("response message is empty" + response.message);
      return response.message;
    }
  } else {
    customLog("response was failed");
    return "エラーです";
  }   
}

export default ChatWithAiTest;

export interface ExtendMessageModel extends MessageModel {
  id?: string;
}

export interface SqlModel {
  sql?: string;
  sql_result?: string;
}

export interface AnswerModel {
  type: string,
  message: string
}

export interface SqlResponseModel {
  result: string,
  message: string
}