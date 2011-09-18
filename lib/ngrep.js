var fs = require('fs'),
    path = require('path');

var running = 0,
    concurrency = 64;

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

  // simple mutex to not exceed maximum number of open files (ulimit -n)
  if (running > concurrency) {
    return process.nextTick(function () {
      processFile(pattern, file, callback);
    });
  }
  running++;

  fs.readFile(file, function (err, data) {
    running--;
    if (err) {
      return console.error('Error ' + err.toString() + ' while processing ' +
                           'file ' + file);
    }
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
      r.file = file;
      r.context = r.input.slice(context_start + 1, context_stop - 1);
      callback(r);
    }
  });
}

function processDirectory(pattern, target, callback) {
  fs.readdir(target, function (err, files) {
    if (err) {
      return console.error('Error ' + err.toString() + ' while processing ' + 
                           'directory ' + target);
    }
    files.forEach(function (file) {
      file = path.join(target, file);
      fs.lstat(file, function (err, stat) {
        // TODO: error handling
        if (stat.isDirectory()) {
          return processDirectory(pattern, file, callback);
        }
        if (stat.isFile()) {
          return processFile(pattern, file, callback);
        }
      });
    });
  });
}

