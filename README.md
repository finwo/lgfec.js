LG FEC
------

Lagrange interpolation based forward error correction

What
====

This library is built to split a Uint8Array into separate equally-sized chunks,
adding chunks to be able to reconstruct the original Uint8Array as long as
{quorum} chunks remain.

The chunks are build (and restored) using lagrange interpolation, similar to how
[shamir secret sharing](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing)
works over a finite field (2^8), using the original data as the lower-bound
shares.

Quirks
======

When your data is not nicely dividable by the quorum number, 0-bytes will be
appended to the data.

If you need an exact reconstruction, use `splitExact` and `combineExact`
instead. These will prefix the data with a length indicator before handing the
data off to `split` and `combine`, limiting the max data size to 2GiB but
ensuring you get back the exact same bytes.

Usage
=====

```typescript
import { split, combine } from '@finwo/lgfec';

// Prepare data
const original = "Hello World!";
const encoder  = new TextEncoder();
const decoder  = new TextDecoder();
const data     = encoder.encode(original);

// Configuration of this example
const shares = 8;
const quorum = 5;

// Generate FEC chunks
let chunks = split(data, shares, quorum);

// Delete chunks, keep {quorum}
delete chunks[2];
delete chunks[4];
delete chunks[6];
chunks = Object.values(chunks);

// Reconstruct the original
const reconstructed = combine(chunks);
if (!reconstructed) {
  throw new Error("Error during combining chunks");
}

// Get back a string
const decoded = decoder.decode(reconstructed);

// And some debug logging
console.log({ original, decoded });
```
