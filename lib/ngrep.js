var fs = require('fs'),
    path = require('path');

function ngrep(pattern, target, callback) {
  fs.lstat(target, function (err, stat) {
    if (err) {
      return callback(err);
    }
    if (stat.isDirectory()) {
      return processDirectory(pattern, target, callback);
    }
    if (stat.isFile()) {
      return processFile(pattern, target, callback);
    }
  });
}
module.exports = ngrep;

function processFile(pattern, file, callback) {
  // make sure that pattern is global, or we'll run OOM
  fs.readFile(file, function (err, data) {
    var r;
    while (r = pattern.exec(data)) {
      var context_stop = r.input.indexOf("\n", r.index);
      var context_start = 0;
      for (var i = r.index; i >= 0; i--) {
        if (r.input[i] == "\n") {
          context_start = i;
          break;
        }
      }
      r.context = r.input.slice(context_start + 1, context_stop - 1);
      callback(r);
    }
  });
}

