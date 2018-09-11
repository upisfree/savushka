import https = require('https');
import CONFIG from './config';
import TelegramBot from './telegram';
import VKBot from './vk';
import log from './log';

log('SAVUSHKA STARTED');

var telegramBot = new TelegramBot();
var vkBot = new VKBot();

telegramBot.getChannelId()
  .then(() => {
    vkBot.setUpdatesCallback((urls) => {
      telegramBot.sendUrlsToChannel(urls);
    });
  });

// telegramBot.getChannelId(() => {
//   vkBot = new VKBot((urls) => {
//     telegramBot.sendUrlsToChannel(urls);
//   });
// });