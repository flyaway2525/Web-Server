// server/pages/env_check_test.tsx

const ENV_TEST = process.env.ENV_TEST;

async function fetchData() {
  let data:string | undefined;
  data = ENV_TEST;
  if (data==undefined) return {context: "環境変数が割り当てられてないみたい"};
  return { context: data };
}


// ページコンポーネント
function EnvCheckTest({ data }: any) {
  return (
    <div>
      <h1>env test!!</h1>
      <p>env : {data.context}</p>
    </div>
  );
}

// サーバーサイドでデータを取得する関数
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

export default EnvCheckTest;
