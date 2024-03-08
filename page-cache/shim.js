function writeFileSync(file, data, options) {
  let fs = {};
  eval("fs = require('fs');")
  fs.writeFileSync(file, data);
}

module.exports = writeFileSync
