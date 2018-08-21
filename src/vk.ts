import { VKApi, ConsoleLogger, BotsLongPollUpdatesProvider } from 'node-vk-sdk';
import CONFIG from './config';

class VK {
  private api: VKApi;
  private botInstance: BotsLongPollUpdatesProvider;

  constructor(onUpdatesCallback) {
    this.api = new VKApi({
      token: CONFIG.VK.GROUP_TOKEN,
      logger: new ConsoleLogger()
    });

    this.botInstance = new BotsLongPollUpdatesProvider(this.api, CONFIG.VK.GROUP_ID);

    this.botInstance.getUpdates((updates) => {
      this.onUpdates(updates, onUpdatesCallback);
    });

    console.log('vk bot inited');
  }

  public onUpdates(updates, callback): void {
    console.log('[vk bot] updates count: ' + updates.length);

    if (updates.length) {
      for (let a = 0; a < updates.length; a++) {
        // TODO: create type for this object
        let attachments = updates[a].object.attachments;
        let urls: any[] = [];

        console.log('[vk bot] attachments count: ' + attachments.length);

        if (attachments) {
          for (let b = 0; b < attachments.length; b++) {
            if (attachments[b].audio) {
              console.log('[vk bot]: got audio ' + attachments[b].audio.artist + ' — ' + attachments[b].audio.title);
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