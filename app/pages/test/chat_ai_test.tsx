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
      <h1>Interaction with ChatGPT 3.5</h1>
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
  let data: any = undefined;
  try{
    data = await fetch('/api/getCustomMessageFromChatGPT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: context }),
    });
  }catch(e){
    console.log("Error : chat_ai_test.tsx is bad function");
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