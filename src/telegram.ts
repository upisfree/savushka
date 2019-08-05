import https = require('https');
import fs = require('fs');
import TelegramBot = require('node-telegram-bot-api');
import CONFIG from './config';
import VK from './vk';
import log from './log';

namespace Telegram {
  export class Bot {
    private botInstance: TelegramBot;
    private channelId: number;

    constructor() {
      this.botInstance = new TelegramBot(CONFIG.TELEGRAM.BOT_TOKEN, {
        polling: false,
        filepath: false, // improve perfomance cause we use stream for file sending (https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#performance-issue)
      });

      log('[tg]', 'bot inited');
    }

    public sendUrlsToChannel(urls: VK.Audio[]): void {
      for (let i = 0; i < urls.length; i++) {
        let file = fs.createWriteStream(`tmp/${ urls[i].artist } — ${ urls[i].title }.mp3`);

        let get = https.get(urls[i].url, (res) => {
          res.pipe(file);

          let fileOptions: TelegramBot.SendAudioOptions = {
            performer: urls[i].artist,
            title: urls[i].title,
          };

          this.botInstance.sendAudio(CONFIG.TELEGRAM.GROUP_URL, res, fileOptions).then((m) => {
            log('[tg]', `send audio "${ urls[i].artist } — ${ urls[i].title }"`);
          }, (e) => {
            log('[tg]', 'sendUrlsToChannel() failed:', e);
          });
        });
      };
    }
  }
}

export default Telegram;