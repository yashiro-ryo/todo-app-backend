const path = require('path');

module.exports = {
  // モードの設定
  mode: 'development',

  // エントリーポイントの設定
  entry: `./src/index.js`,

  // ファイルの出力設定
  output: {
    // 出力するファイル名
    filename: "bundle.js",

    //  出力先のパス
    path: path.join(__dirname, 'dist')
  }
};