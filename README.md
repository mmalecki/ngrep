# ngrep - asynchronous grep
Copyright (C) 2011 by Maciej Małecki

MIT License (see LICENSE file)

ngrep does what grep does, but asynchronously. It was inspired by @AvianFlu's
[ncp](https://github.com/AvianFlu/ncp), which you should be already using.

## Installation
It's on [npm](http://search.npmjs.org/#/ngrep)! `npm install ngrep`.

## Usage
To grep directory `dir` for string `foo`: `ngrep foo dir` (it couldn't get
any simpler than that).

It can also grep files, but this is just slower than regular grep:
`ngrep foo file`.

