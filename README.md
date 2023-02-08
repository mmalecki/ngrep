# ngrep - asynchronous grep
Copyright (C) 2011 by Maciej Małecki

MIT License (see LICENSE file)

ngrep does what grep does, but asynchronously.

## Installation

### As an executable
```sh
npm -g install ngrep
```

### As a library
```sh
npm install ngrep
```

## Usage

### As an executable
To grep directory `dir` for string `foo`: `ngrep foo dir` (it couldn't get
any simpler than that).

It can also grep files, but this is just slower than regular grep:
`ngrep foo file`.

### As a library
To grep directory `dir` for RegExp `/foo/g`:

```js
var ngrep = require('ngrep');
ngrep(/foo/g, 'dir', function (result) {
  console.log(result.file + ': ' + console.context);
});
```
