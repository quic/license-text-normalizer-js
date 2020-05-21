# License Text Normalizer

Library that provides license text normalization functionality in JavaScript.

A python implementation is also available: https://github.com/quic/license-text-normalizer

## Requirements

* node 10+
* yarn 1.9+

## Usage

### Normalize a license text using the default set of delimiters

```js
import { strict as assert } from 'assert';
import normalizeLicenseText from 'license-text-normalizer';

const text = `/* Copyright 2010 Google Inc. All Rights Reserved.\n */`
assert(normalizeLicenseText(text) === 'Copyright 2010 Google Inc. All Rights Reserved.')
```

### Normalize a license text using a custom set of delimiters

```js
import { strict as assert } from 'assert';
import normalizeLicenseText from 'license-text-normalizer';

const text = `XXX\nCopyright 2010 Google Inc. All Rights Reserved.`
assert(normalizeLicenseText(text, ['XXX']) === 'Copyright 2010 Google Inc. All Rights Reserved.')
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

License Text Normalizer is licensed under the BSD 3-clause “New” or “Revised” License. See [LICENSE](LICENSE) for the full license text.
