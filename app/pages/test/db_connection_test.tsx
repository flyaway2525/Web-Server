// server/pages/db.tsx

import { table } from 'console';
import * as mysql from 'promise-mysql';

// MySQLデータベースに接続してデータを取得する関数
async function fetchData() {
  const connection = await mysql.createConnection({
    // 接続テスト用,本来ここに直接パスワードを書いたりはダメ
    host: 'db', // どこからとってくるのかは不明,コンテナサービス名らしいが...？
    user: 'root',
    port: 3306,
    password: 'password',
    database: 'sampleDB'
  });

  const data = await connection.query('SELECT * FROM sampleTable');
  const serializableData = data.map((item: { dateColumn: { toISOString: () => any; }; }) => ({
    ...item,
    dateColumn: item.dateColumn ? item.dateColumn.toISOString() : null  // Dateオブジェクトを文字列に変換
  }));
  await connection.end();
  console.log(serializableData);
  return serializableData;
}

// ページコンポーネント
function DbPage({ data }: any) {
  return (
    <div>
      <h1>Mysql Database Connection Test!!</h1>
      <table style={tableStyle}>
        <thead><tr><th>ID</th><th>Name</th></tr></thead>
        <tbody>
          {data.map((item: any, index: any) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse', // 枠線を重ねる
  backgroundColor: '#EEEEEE', // 背景色を薄い灰色に設定
};

// サーバーサイドでデータを取得する関数
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

export default DbPage;
