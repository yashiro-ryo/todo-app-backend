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
