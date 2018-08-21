import https = require('https');
import fs = require('fs');
import TelegramBot = require('node-telegram-bot-api');
import CONFIG from './config';

class Telegram {
  private botInstance: TelegramBot;
  private channelId: number;

  constructor() {
    this.botInstance = new TelegramBot(CONFIG.TELEGRAM.BOT_TOKEN, {
      polling: true
    });

    console.log('telegram bot inited');
  }

  // TODO: rewrite as Promise, not void
  public getChannelId(callback): void {
    this.botInstance.getChat(CONFIG.TELEGRAM.GROUP_URL).then((chat: TelegramBot.Chat) => {
      this.channelId = chat.id;

      callback();
    });
  }

  public sendUrlsToChannel(urls): void {
    for (var i = 0; i < urls.length; i++) {
      let file = fs.createWriteStream('tmp/' + i + '.mp3');
      let get = https.get(urls[i], (res) => {
        res.pipe(file);

        // perfomance tip here: https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#sending-files
        this.botInstance.sendAudio(this.channelId, res).then((m) => {
          console.log('[telegram bot]: send audio');
        }, (e) => {
          console.log(e);
        });
      });
    };
  }
}

export default Telegram;