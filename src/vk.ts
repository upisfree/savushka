import VKBot = require('vk-node-sdk');
import CONFIG from './config';
import log from './log';

namespace VK {
  export interface Audio {
    artist: string,
    title: string,
    url: string
  }

  export class Bot {
    private api: any;

    constructor() {
      this.api = new VKBot.Group(CONFIG.VK.GROUP_TOKEN);

      log('[vk]', 'bot inited');
    }

    public onMessage(callback): void {
      this.api.onMessage((message) => {
        if (message.attachments.length) {
          let attachments = message.attachments;
          let urls: Audio[] = [];

          log('[vk]', 'attachments count: ' + attachments.length);

          for (let i = 0; i < attachments.length; i++) {
            let attachment = attachments[i];

            switch (attachment.type) {
              case 'audio':
                log('[vk]', `got audio "${ attachment.audio.artist } — ${ attachment.audio.title }"`);

                if (attachment.audio.url) {
                  urls.push({
                    artist: attachment.audio.artist,
                    title: attachment.audio.title,
                    url: attachment.audio.url
                  } as Audio);
                }

                break;
            }
          }

          callback(urls);
        }
      });
    }
  }
}

export default VK;