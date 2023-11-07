import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from '@chatscope/chat-ui-kit-react';

// ページコンポーネント
function ChatUiTest() {
  // メッセージのstateを作成
  const [messages, setMessages] = useState<Array<MessageModel>>([
    {
      message: "初期入力メッセージ",
      sentTime: "just now",
      sender: "Bot",
      direction: "outgoing",
      position: "single"
    }
  ]);

  const handleSendMessage = (messageText:string) => {
    const newMessage:MessageModel = {
      message: messageText,
      sentTime: "just now",
      sender: "User",
      direction: "incoming",
      position: "single"
    };
    setMessages([...messages, newMessage]);

    // 固定の返信メッセージを送信
    setTimeout(() => {
      const replyMessage:MessageModel = {
        message: "Thank you for your message!",
        sentTime: "just now",
        sender: "Bot",
        direction: "outgoing",
        position: "single"
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 1000);
  };

  return (
    <div>
      <h1>Chat UI Kit for react</h1>
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {messages.map(msg => (
                <Message model={msg} />
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

export default ChatUiTest;
