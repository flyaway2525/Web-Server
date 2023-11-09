// server/pages/azure_ai_connection_test.tsx

import { customLog } from "@/utils/customLog";

const API_KEY: string = process.env.AZURE_AI_API_KEY_CHATGPT35!;
const AZURE_AI_SERVER_URL: string = process.env.AZURE_AI_SERVER_URL!;

async function fetchData() {
  const headers = new Headers();
  headers.append("api-key", API_KEY);
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
      "messages": [
        {
          "role": "system",
          "content": "You are an AI assistant that helps people find information."
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

  // ビルドするたびにAPIが走るので,回避中
  customLog("実行にはソースの修正が必要です.","DEBUG");
  return {context: "実行にはソースの修正が必要です."};
  const response = await fetch(AZURE_AI_SERVER_URL, requestOptions);
  let data = undefined;
  if (response.ok) {
    data = await response.json();
    customLog(data, "DEBUG");
  } else {
    console.log('Network response was not ok');
  }
  return { context: data };
}

// ページコンポーネント
function HelloAzureAI({ context }: any) {
  return (
    <div>
      <h1>TestJson!!</h1>
      <pre>{JSON.stringify(context, null, 2)}</pre>
    </div>
  );
}

// サーバーサイドでデータを取得する関数
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { ...data } };
}

export default HelloAzureAI;
