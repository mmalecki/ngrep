# ngrep - asynchronous grep
Copyright (C) 2011 by Maciej Małecki

MIT License (see LICENSE file)

ngrep does what grep does, but asynchronously. It was inspired by @AvianFlu's
[ncp](https://github.com/AvianFlu/ncp), which you should be already using.

## Installation

### As an executable
It's on [npm](http://search.npmjs.org/#/ngrep)! `npm install -g ngrep`.

In some cases (e.g. if your node installation is system-wide), you will need to
`sudo npm install -g ngrep`.

### As a library
ngrep is so cool that you can use it in your application! In this case just
add it as a dependency or `npm install ngrep` in your app's directory.

## Usage

### As an executable
To grep directory `dir` for string `foo`: `ngrep foo dir` (it couldn't get
any simpler than that).

It can also grep files, but this is just slower than regular grep:
`ngrep foo file`.

### As a library
To grep directory `dir` for RegExp `/foo/g`:

    var ngrep = require('ngrep');
    ngrep(/foo/g, 'dir', function (result) {
      console.log(result.file + ': ' + console.context);
    });

