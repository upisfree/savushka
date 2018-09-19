import rimraf = require('rimraf');
import CONFIG from './config';
import log from './log';
import mkdir from './mkdir';
import Telegram from './telegram';
import VK from './vk';

rimraf.sync('tmp');
mkdir('tmp');

log('SAVUSHKA STARTED');

var telegramBot = new Telegram.Bot();
var vkBot = new VK.Bot();

vkBot.onMessage((urls) => {
  telegramBot.sendUrlsToChannel(urls);
});