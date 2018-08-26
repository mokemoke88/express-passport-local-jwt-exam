/**
 * @file service/app.ts
 */

import { Server } from 'net';
import { ExpressApp } from './express';

import { config } from './config';

/**
 * ユーザーアプリケーションクラス
 */
class Application {
  private context: Server | null = null;

  /**
   * ExpressアプリケーションをListn状態にする.
   */
  public run() {
    if (this.context !== null) {
      return;
    }

    this.context = ExpressApp.listen(config.httpPort, () => {
      console.log('http service listen at ', config.httpPort);
    });
  }

  /**
   * 終了処理.
   *
   * Expressアプリケーションが返したサーバー接続を閉じる.
   */
  public async close(): Promise<void> {
    if (this.context === null) {
      return;
    }
    return new Promise<void>(resolve => {
      if (this.context !== null) {
        this.context.close(() => {
          resolve();
        });
      } else {
        return resolve();
      }
    });
  }
}

const App = new Application();

// SIGTERM シグナル受信時の処理
// 終了処理を実行する.
process.on('SIGTERM', async () => {
  await App.close();
});

// SIGINT シグナル受信時の処理
// 終了処理を実行する.
process.on('SIGINT', async () => {
  await App.close();
});

export { App };
