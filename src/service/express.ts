/**
 * @file express.ts
 *
 * Express の設定を行います.
 *  - ミドルウェアの設定
 *    - body-parser
 *    - passport
 *    - ルートの設定
 */

import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';

import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Strategy as localStrategy } from 'passport-local';

import { apiRoutes } from './routers/api.routes';
import { authRoutes } from './routers/auth.routes';

import { config } from './config';

/**
 * Express エラーハンドラ用Errorインタフェース
 */
interface Error {
  status?: number;
  message?: string;
}

const app = express();

// jwtで使用するシードの設定
app.set('superSecrets', config.superSecret);

////////////////////////////
// ミドルウェア設定
///////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////
// passport 関係
///////////////////////////

// passport の初期化
app.use(passport.initialize());

// local認証を設定
passport.use(
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    // local検証ハンドラ
    // username, passwordを検証し, 問題なければ、done(null, 認証情報オブジェクト)を実行,
    // 問題があれば, done(null, false)を実行します.
    // doneに渡した認証情報オブジェクトは,後続のミドルウェアからはrequest.userで参照可能です.
    // * リクエストにパラーメータが存在しない等、リクエスト自体が不正な場合は、ここ以前で弾かれています.
    // 検証処理でブロックしないように, Promiseで処理.
    (username, password, done) => {
      return new Promise<any>((resolve, reject) => {
        try {
          if (username === 'kshibata' && password === 'passwd') {
            return resolve({ id: 'kshibata' });
          } else {
            return resolve(false);
          }
        } catch (e) {
          return reject(e);
        }
      })
        .then(user => {
          done(null, user);
        })
        .catch(err => done(err));
    }
  ) // new localStrategy...
); // passport.use ...

// JWT認証を設定
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: app.get('superSecrets'),
    },
    // jwt検証ハンドラ
    // payloadを検証し, 問題なければ、done(null, 認証情報オブジェクト)を実行,
    // 問題があれば, done(null, false)を実行します.
    // doneに渡した認証情報オブジェクトは,後続のミドルウェアからはrequest.userで参照可能です.
    // * JWT認証トークン自体が不正な場合は、ここ以前で弾かれています.
    // 検証処理でブロックしないように, Promiseで処理.
    (payload: any, done: any) => {
      return new Promise<any>((resolve, reject) => {
        try {
          return resolve(payload.id);
        } catch (e) {
          return reject(e);
        }
      })
        .then(user => {
          return done(null, user);
        })
        .catch(err => done(err));
    }
  )
); // passport.use ...

//////////////////////////////////////
// ルート設定
//////////////////////////////////////

// トークン発行ページ
app.use(authRoutes);

// JWT認証ルート
app.use('/api', passport.authenticate('jwt', { session: false }), apiRoutes);

// any routes...

// 一致するルートがない場合
app.use((req, res) => {
  res.status(404).json({ status: 'FAIL', result: 'Not Found.' });
});

// エラーハンドラ
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ status: 'FAIL', result: 'INTERNAL SERVER ERROR' });
  return;
});

export { app as ExpressApp };
