import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from '@chatscope/chat-ui-kit-react';
// TODO　: 環境変数周りの整備
import {API_KEY, AZURE_AI_SERVER_URL} from '../test/azure_ai_connection_test';
import { v4 as uuidv4 } from 'uuid';

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
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // AIによる返答を作成する.
    try {
      const replyMessageText: string = await fetchData(messageText);
      const replyMessage: ExtendMessageModel = {
        id: uuidv4(),
        message: replyMessageText,
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
      <h1>Chat UI Kit for react</h1>
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
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
        </MainContainer>
      </div>
    </div>
  );
}

// APIを叩いてレスポンスを受ける.
async function fetchData(context:string): Promise<string> {
    let data: any; // OpenAIのレスポンスのJSON型,適切な型リストが見つかり次第実装予定

    const headers = new Headers();
    headers.append("api-key", API_KEY);
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
        "messages": [
          {
            "role": "system",
            "content": context
          }
        ],
        "temperature": 0.7,
        "top_p": 0.95,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "max_tokens": 800,
        "stop": null
      }
    );

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: body
    };

    const response = await fetch(AZURE_AI_SERVER_URL, requestOptions);
    if (response.ok) {
      data = await response.json();
      console.log("response.ok" + data.choices[0].message.context);
    } else {
      console.log('Network response was not ok');
      return "Network response was not ok";
    }

    return data.choices[0].message.content;
}

export default ChatWithAiTest;

export interface ExtendMessageModel extends MessageModel {
  id?: string;
}