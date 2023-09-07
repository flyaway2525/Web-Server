/** @type {import('next').NextConfig} */
const nextConfig = {
    /** ホットリロードバグ修正 開始 */
    /** Docker環境でNextJSを使用していると外部からの変更を検知しないためホットリロードがかかりません */
    /** 参考文献 : https://qiita.com/fur_orannge/items/90339eab0cd9142dc830 */
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, context) => {
      config.watchOptions = {
        // poll : ファイルチェック頻度(1000msが安定)
        // aggregateTimeout : 同時更新と判定される頻度(300msが安定)
        // pollに関してはリソースに直結するので,多少の更新頻度を犠牲にしてでも安定を取るべき
        poll: 10000,
        aggregateTimeout: 1000
      }
      return config;
    }
    /** ホットリロードバグ修正 終了 */
  }
  module.exports = nextConfig;
  