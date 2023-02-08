var path = require('path');
var assert = require('assert');
var assertCalled = require('assert-called');
var ngrep = require('../');

var dir = path.join(__dirname, 'fixtures', 'dir');

ngrep(/foo/g, dir, assertCalled(function (err, results) {
  assert(!err);
  assert.equal(results.length, 2);

  assert.equal(results[0].file, path.join(dir, 'foo'));
  assert.equal(results[0].context, 'foobar');

  assert.equal(results[1].file, path.join(dir, 'zax'));
  assert.equal(results[1].context, 'foo');
}));
