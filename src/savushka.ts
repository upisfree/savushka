import https = require('https');
import CONFIG from './config';
import TelegramBot from './telegram';
import VKBot from './vk';

var telegramBot = new TelegramBot();
var vkBot;

telegramBot.getChannelId(() => {
  vkBot = new VKBot((urls) => {
    telegramBot.sendUrlsToChannel(urls);
  });
});