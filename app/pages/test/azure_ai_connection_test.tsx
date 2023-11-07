// server/pages/azure_ai_connection_test.tsx

import { customLog } from '@/utils/customLog';

// TODO : 環境変数を用意して、そこに格納する必要がある。
// 応急処置として、空欄にしてGitに上げます。
const API_KEY = "xxx";
const AZURE_AI_SERVER_URL = "https://xxx";

async function fetchData() {
  let data;

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

  // ビルドするたびにAPIが走るので,AZURE_AI_SERVER_URLを変数でなくすことで回避中
  const response = await fetch("AZURE_AI_SERVER_URL", requestOptions);
  if (response.ok) {
    data = await response.json();
    console.log(data);
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
