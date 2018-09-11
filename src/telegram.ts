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
        polling: true,
        filepath: false, // improve perfomance cause we use stream for file sending (https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#performance-issue)
      });

      log('[tg]', 'bot inited');
    }

    public getChannelId(): Promise<number> {
      return this.botInstance.getChat(CONFIG.TELEGRAM.GROUP_URL)
        .catch((reason: any) => log('[tg]', 'getChannelId() failed with reason', reason))
        .then((chat: TelegramBot.Chat) => {
          log('[tg]', 'getChannelId() received id', chat.id);

          this.channelId = chat.id;

          return this.channelId;
        });
    }

    public sendUrlsToChannel(urls: VK.Audio[]): void {
      for (let i = 0; i < urls.length; i++) {
        let file = fs.createWriteStream('tmp/' + i + '.mp3');
        let get = https.get(urls[i].url, (res) => {
          res.pipe(file);

          let fileOptions: TelegramBot.SendAudioOptions = {
            performer: urls[i].artist,
            title: urls[i].title,
          };

          this.botInstance.sendAudio(this.channelId, res, fileOptions).then((m) => {
            console.log('[tg]', 'send audio');
          }, (e) => {
            log('[tg]', 'sendUrlsToChannel() failed:', e);
          });
        });
      };
    }
  }
}

export default Telegram;