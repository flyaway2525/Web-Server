// server/pages/json_get_test.tsx

import { customLog } from '@/utils/customLog';

async function fetchData() {
  let data;
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  if (response.ok) {
    data = await response.json();
    console.log(data);
  } else {
    console.log('Network response was not ok');
  }
  return { context: data };
}

// ページコンポーネント
function HelloJson({ data }: any) {
  return (
    <div>
      <h1>TestJson!!</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// サーバーサイドでデータを取得する関数
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

export default HelloJson;
