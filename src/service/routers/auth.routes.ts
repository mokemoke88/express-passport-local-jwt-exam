/**
 * @file service/routers/auth.route.ts
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

/**
 * 受信した認証情報を検証し、正しければjwtトークンを返します.
 */
router.post(
  '/authenticate',
  // local認証ミドルウェアを実施
  passport.authenticate('local', { session: false }),
  // 認証に成功した場合の処理, 認証情報はreq.userで参照できる.
  (req, res, next) => {
    return new Promise<any>((resolve, reject) => {
      try {
        if (!req.user) {
          throw new Error('req.user is undefined');
        }
        const token = jwt.sign(req.user, req.app.get('superSecrets'));
        return resolve(token);
      } catch (e) {
        return reject(e);
      }
    })
      .then(token => {
        return res.json({ status: 'OK', result: token });
      })
      .catch(e => next(e));
  }
);

export { router as authRoutes };
