/**
 * service/routers/api.routes.ts
 *
 * /api 以下のルート定義を行います.
 */

import express from 'express';

const router = express.Router();

/**
 * 部屋マスタを出力します.
 *
 * * 認証に関する記述が無いことに注目.
 */
router.get('/rooms/all', async (req, res, next) => {
  return new Promise<any>((resolve, reject) => {
    // 時間のかかる処理
    resolve([
      {
        room_id: 'F0001R0001',
        room_name: '1号屋',
        sensors: [
          {
            sensor_id: 'S0000',
            sensor_name: '試験用センサ001',
            sensor_type: 0,
            macaddr: '0000000000',
            version: '0.0.1',
          },
        ],
      },
    ]);
  })
    .then(rooms => {
      if (!rooms) {
        return res.json({ status: 'FAIL', result: 'ROOM NOT EXIST.' });
      }
      return res.json({ status: 'OK', result: rooms });
    })
    .catch(err => next(err));
});

export { router as apiRoutes };
