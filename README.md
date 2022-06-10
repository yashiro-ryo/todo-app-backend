# todo-app backend
## SPA認証周りの仕様
### signin時
signin完了時にjwtトークンが送られ、localStorageに保存される(のちにクッキーに保存にする)
localStorageに保存されているtokenをもとにユーザーの取得やデータの取得をする

