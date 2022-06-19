# todo-app backend
todoアプリ
## 起動方法
### ソースコードの取得
`git clone https://github.com/yashiro-ryo/todo-app-backend.git`
### 必要なパッケージのインストール
`npm install`
### 起動
`cd backend`

`npm run start`

## Router
REST APIで作成

リクエストする際に`{headers: {token: 'example'}}`をつける必要がある

`delete`と`patch`については`token`に編集権限があるかどうかを確認してない場合は`return`する

### GET /tasks
タスクを全て取得するAPI

### GET /tasks/{taskId}
指定の`taskId`のタスクを取得するAPI（不使用)

### POST /tasks
新たにタスクを作成するAPI

### PATCH /tasks/{taskId}
指定の`taskId`のタスクを更新するAPI

### DELETE /tasks/{taskId}
指定の`taskId`のタスクを削除するAPI

## SPA認証周りの仕様

### signin時

signin完了時にバックエンドからフロントエンドにjwtトークンが送られ、localStorageに保存される

localStorageに保存されている`token`をもとにユーザーの取得やデータの取得をする

### signout時

localStorageに保存されている`token`が空文字で上書きされる（削除)

## DBの構造

### userテーブル

|  user_id  |  user_name  |  user_email  |  user_pass_hash  |  user_access_token  |  is_delete_modal  |
| --------- | ----------- | ------------ | ---------------- | ------------------- | ----------------- |

### taskテーブル

|  task_id  |  task_user_id  |  task_name  |  task_describe  |  task_deadline  |  task_is_completed  |
| --------- | -------------- | ----------- | --------------- | --------------- | ------------------- |

## ファイル構造

<pre>
.
├── README.md   このファイル
├── index.ts    エントリーポイント
├── package-lock.json
├── package.json
├── public
│   ├── build   フロントエンドがデプロイされている
│   │   ├── asset-manifest.json
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── static
│   │       ├── css
│   │       │   ├── main.674b0765.css
│   │       │   └── main.674b0765.css.map
│   │       └── js
│   │           ├── 787.cda612ba.chunk.js
│   │           ├── 787.cda612ba.chunk.js.map
│   │           ├── main.93a91971.js
│   │           ├── main.93a91971.js.LICENSE.txt
│   │           └── main.93a91971.js.map
│   ├── css     signin, signupに使われるcss
│   │   ├── bootstrap.min.css
│   │   ├── bootstrap.min.css.map
│   │   ├── signin.css
│   │   └── signup.css
│   ├── html    signin, signupで使われるhtml 
│   │   ├── signin.html
│   │   └── signup.html
│   └── js
│       └── axios.min.js
├── router
│   ├── authRouter.ts   ログイン周りのrouter
│   ├── restRouter.ts   REST APIのrouter
│   └── userRouter.ts   ユーザー情報取得のrouter
├── service
│   ├── authService.ts  ログインなどの処理
│   └── database.ts     REST APIの処理や認証など
├── tsconfig.json
└── yarn.lock
</pre>

## デプロイ

### URL
https://todo-app-yashiro.herokuapp.com/

### デモアカウント

email: testuser@test.com

pass : test

## 改善点

REST API

->url queryにuserIdやtaskIdを含めた方がよい

->tokenの隠し場所をcookieにする(試してみる)

Router

->routerを使用しているのでurlをrewriteしないと表示できない

表示に時間がかかってしまう(-> show on offで制御する)

->するにしても少なくする

Database

->dbがincrementしてしまうのでtask_idが頭打ちになるかも

個別(ユーザーごと)にdbを設定した方がよいかも

->仕様を練っておくべき

->本番ように使用するにはバックアップとか暗号化、権限限定などする必要がありそう

->sqlインジェクションも

React

->react useStateで更新がdelete以外うまくいかない

->webpackでビルドできるようにする

CreateReactAppではoutDirが設定できなかった(めんどい)

描画が遅いのでソースコードをminifyする

Express

Https化はいらない？

Helmetを入れる(脆弱性対策?)

https://qiita.com/qianer-fengtian/items/148602c437e1703aa764#:~:text=Helmet%20%E3%81%AF%20Express%20%E3%81%A7%E4%BD%9C%E6%88%90,%E5%A0%85%E7%89%A2%E5%8C%96%E3%81%99%E3%82%8B%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%81%A7%E3%81%99%E3%80%82

↑参考になりそう

expressもwebpackでビルドするようにする

process.env.PORTにする(デプロイ時にはまった)

node.jsの場合は

https://github.com/heroku/node-js-getting-started

↑参考にする

