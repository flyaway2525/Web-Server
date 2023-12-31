// server/pages/db.tsx

import { customLog } from '@/utils/customLog';
import * as mysql from 'promise-mysql';

// MySQLデータベースに接続してデータを取得する関数
async function fetchData() {
  let connection: mysql.Connection | undefined;
  try {
    connection = await mysql.createConnection({
      // 接続テスト用,本来ここに直接パスワードを書いたりはダメ
      host: 'db', // どこからとってくるのかは不明,コンテナサービス名らしいが...？
      user: 'root',
      port: 3306,
      password: 'password',
      database: 'sampleDB'
    });
    console.log('Connection successful');
  } catch (error: any) {
    switch (error.code) {
      case 'ENOTFOUND':
      case 'EHOSTUNREACH':
        console.error('Host does not exist or is unreachable');
        break;
      case 'ECONNREFUSED':
        console.error('Port is not open on the host');
        break;
      case 'ER_ACCESS_DENIED_ERROR':
        console.error('Invalid user or password');
        break;
      case 'ER_NOT_SUPPORTED_AUTH_MODE':
        console.error('root user cannot use');
        break;
      case 'ER_BAD_DB_ERROR':
        console.error('Database does not exist');
        break;
      default:
        console.error('Unknown error: ', error);
    }
    customLog(error.sqlMessage);
    if (connection && connection.end)await connection.end();
    return null;
  }

  const data = await connection.query('SELECT * FROM sampleTable');
  const serializableData = data.map((item: { dateColumn: { toISOString: () => any; }; }) => ({
    ...item,
    dateColumn: item.dateColumn ? item.dateColumn.toISOString() : null  // Dateオブジェクトを文字列に変換
  }));
  if (connection && connection.end)await connection.end();
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
