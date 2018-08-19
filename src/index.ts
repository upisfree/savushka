import https = require('https');
import fs = require('fs');
import CONFIG from './config';
import { VKApi, ConsoleLogger, BotsLongPollUpdatesProvider } from 'node-vk-sdk';
import TelegramBot = require('node-telegram-bot-api');

// telegram init
let bot = new TelegramBot(CONFIG.TELEGRAM.BOT_TOKEN, { polling: true });

console.log('telegram bot inited');

// vk init
let api = new VKApi({
  token: CONFIG.VK.GROUP_TOKEN,
  logger: new ConsoleLogger()
});

console.log('vk bot inited');

let updatesProvider = new BotsLongPollUpdatesProvider(api, CONFIG.VK.GROUP_ID);

bot.getChat(CONFIG.TELEGRAM.GROUP_URL).then((chat: TelegramBot.Chat) => {
  console.log('chanel id received');
  
  updatesProvider.getUpdates(updates => {
    console.log('[vk bot] updates count: ' + updates.length);

    if (updates.length) {
      for (let a = 0; a < updates.length; a++) {
        let attachments = updates[a].object.attachments;

        console.log('[vk bot] attachments count: ' + attachments.length);

        if (attachments) {
          for (let b = 0; b < attachments.length; b++) {
            if (attachments[b].audio) {
              console.log('[vk bot]: got audio ' + attachments[b].audio.title);
              

// http.get(url.parse('http://myserver.com:9999/package'), function(res) {
//     var data = [];

//     res.on('data', function(chunk) {
//         data.push(chunk);
//     }).on('end', function() {
//         //at this point data is an array of Buffers
//         //so Buffer.concat() can make us a new Buffer
//         //of all of them together
//         var buffer = Buffer.concat(data);
//         console.log(buffer.toString('base64'));
//     });
// });

              
              let file = fs.createWriteStream('mp3.mp3');
              let get = https.get(attachments[b].audio.url, (res) => {
                res.pipe(file);

                // perfomance tip here: https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#sending-files
                bot.sendAudio(chat.id, res).then((m) => {
                  console.log('[telegram bot]: send audio');
                }, (e) => {
                  console.log(e);
                });
              });
            }
          }
        }
      }
    }
  });
});