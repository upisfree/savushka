// this is simple wrapper above node's fs.mkdirSync but with ignoring existing directories
import fs = require('fs');

export default function(name) {
  try {
    fs.mkdirSync(name);  
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
};