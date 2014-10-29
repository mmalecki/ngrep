var fs = require('fs'),
    path = require('path'),
    once = require('once');

var running = 0,
    concurrency = 512;

function ngrep(pattern, target, cb_) {
  var results = [];
  var cb = once(cb_);

  fs.lstat(target, function (err, stat) {
    if (err) {
      return cb(err);
    }

    if (stat.isDirectory()) {
      return processDirectory(pattern, target, cb);
    }
    return processFile(pattern, target, cb);
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
    var r;
    var results = [];

    running--;
    if (err) {
      return callback(err);
    }

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
      r.context = r.input.slice(context_start, context_stop);
      results.push(r);
    }

    callback(null, results);
  });
}

function processDirectory(pattern, target, callback) {
  fs.readdir(target, function (err, files) {
    var results = [];
    var entriesProcessed = 0;

    function onprocessed(err, result) {
      if (err) return callback(err);
      Array.prototype.push.apply(results, result);
      if ((++entriesProcessed) === files.length) {
        return callback(null, results);
      }
    }

    if (err) {
      return callback(err);
    }

    files.forEach(function (file) {
      file = path.join(target, file);
      fs.lstat(file, function (err, stat) {
        if (err) {
          return callback(err);
        }

        if (stat.isDirectory()) {
          return processDirectory(pattern, file, onprocessed);
        }
        if (stat.isFile()) {
          return processFile(pattern, file, onprocessed);
        }
      });
    });
  });
}

