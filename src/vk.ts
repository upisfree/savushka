import { VKApi, ConsoleLogger, BotsLongPollUpdatesProvider } from 'node-vk-sdk';
import CONFIG from './config';
import log from './log';

class VK {
  private api: VKApi;
  private botInstance: BotsLongPollUpdatesProvider;

  constructor() {
    this.api = new VKApi({
      token: CONFIG.VK.GROUP_TOKEN,
      logger: new ConsoleLogger()
    });

    this.botInstance = new BotsLongPollUpdatesProvider(this.api, CONFIG.VK.GROUP_ID);

    log('[vk]', 'bot inited');
  }

  public setUpdatesCallback(callback): void {
    this.botInstance.getUpdates((updates) => {
      this.onUpdates(updates, callback);
    });
  }

  public onUpdates(updates, callback): void {
    if (updates.length) {
      log('[vk]', 'updates received, count:', updates.length);

      for (let a = 0; a < updates.length; a++) {
        // TODO: create type for this object
        let attachments = updates[a].object.attachments;
        let urls: any[] = [];

        log('[vkъ', 'attachments count: ' + attachments.length);

        if (attachments) {
          for (let b = 0; b < attachments.length; b++) {
            if (attachments[b].audio) {
              log('[vk]', 'got audio ' + attachments[b].audio.artist + ' — ' + attachments[b].audio.title);
              // console.log(attachments[b].audio);

              if (attachments[b].audio.url) {
                urls.push(attachments[b].audio.url);
              }
            }
          }

          callback(urls);
        }
      }
    }
  }
}

export default VK;