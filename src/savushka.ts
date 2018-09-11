import https = require('https');
import CONFIG from './config';
import TelegramBot from './telegram';
import VKBot from './vk';
import log from './log';

var telegramBot = new TelegramBot();
var vkBot;

log('SAVUSHKA STARTED');

telegramBot.getChannelId(() => {
  vkBot = new VKBot((urls) => {
    telegramBot.sendUrlsToChannel(urls);
  });
});