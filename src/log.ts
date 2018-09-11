import fs = require('fs');
import CONFIG from './config';

var stream = fs.createWriteStream(CONFIG.LOGGING.FILENAME, {
  flags: 'a'
});

export default function(...messages) {
  if (CONFIG.LOGGING.ENABLED) {
    let d = new Date();
    let m = `[${ d.toUTCString() }] `;

    for (let i = 0; i < messages.length; ++i) {
      m += `${ messages[i].toString() } `;
    }

    console.log(m);

    m += '\n';

    stream.write(m);
  }
};