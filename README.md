# MXUTILS

Thuku's assorted general purpose typescript/javascript library.

_**♠️ By [Thuku](https://github.com/xthukuh)**_

## Installation

```bash
# node
npm install mxutils

# yarn
yarn add mxutils
```

## Usage
```ts
// typescript
import {_uid} from 'mxutils';
import * as mxutils from 'mxutils';
console.debug(_uid(), mxutils._datetime());

// module
const mxutils = require('mxutils');
console.debug(mxutils._datetime());
```

## Development

```bash
# clone
git clone https://github.com/xthukuh/mxutils.git

# node
npm install
npm run dev
npm test
## npm test -- _number.test.ts ## specific test

# yarn
yarn install
yarn dev
yarn test
```