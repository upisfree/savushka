import CONFIG from './config';
import log from './log';
import Telegram from './telegram';
import VK from './vk';

log('SAVUSHKA STARTED');

var telegramBot = new Telegram.Bot();
var vkBot = new VK.Bot();

telegramBot.getChannelId()
  .then(() => {
    vkBot.setUpdatesCallback((urls) => {
      telegramBot.sendUrlsToChannel(urls);
    });
  });