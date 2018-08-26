# Express + Passport を使った ローカル認証 + Jwt認証の実装例

## やりたいこと

- ユーザー名, パスワードを使用したよくある認証を行なった後, JSONオブジェクトで認証トークンを発行する.
```
{
  "status": "OK",
  "result": "{{ 認証トークン }}
}
```

- リクエストヘッダ含まれた認証トークンで,WEBAPIの利用可否の認証を行う.
```
Authorization: Bearer {{ 認証トークン }}
```

## node.js

v10.8.0

## パッケージ導入

```
> npm i -D typescript tslint prettier tslint-plugin-prettier tslint-config-prettier webpack webpack-cli webpack-node-externals ts-loader @types/node
> npm i express passport passport-local passport-jwt jsonwebtoken body-parser
> npm i -D @types/node @types/express @types/passport @types/passport-local @types/passport-jwt @types/jsonwebtoken @types/body-parser
```

## ソース構成

+ src
  + service
    + routes
      - api.routes.ts jwt認証が必要なAPIの実装です.
      - auth.routes.ts ローカル認証を行いjwtを発行する処理の実装です.
    - app.ts ユーザアプリケーションクラス
    - express.ts Expressアプリケーションの設定処理.
  - index.ts エントリポイント
