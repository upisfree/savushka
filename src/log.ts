import fs = require('fs');
import CONFIG from './config';
import mkdir from './mkdir';

if (CONFIG.IS_LOGGING_ENABLED) {
  mkdir('log');
}

let fileName = new Date().toISOString().split('.')[0].replace(/:/g, '-'); // remove milliseconds and replace : with - because Windows file name restrictions
let stream = fs.createWriteStream(`log/${ fileName }.log`, {
  flags: 'a'
});

export default function(...messages) {
  if (CONFIG.IS_LOGGING_ENABLED) {
    let d = new Date();
    let m = `[${ d.toUTCString() }] `;

    for (let i = 0; i < messages.length; ++i) {
      m += `${ messages[i].toString() } `; // TODO: ну чёт здесь нихуя не пишутся ошибки
    }

    console.log(m);

    m += '\n';

    stream.write(m);
  }
};