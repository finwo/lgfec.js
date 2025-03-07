import * as test from 'tape';
import { split, combine } from '../src/main';

const encoder  = new TextEncoder();
const decoder  = new TextDecoder();

test('Encoding/decoding test', t => {
  const testCount = 16;
  t.plan(testCount);
  const shares = 2;
  const quorum = 2;
  const values = new Array(testCount).fill(0).map(() => Math.random().toString(36).slice(2));
  for(let i=0; i < values.length; i++) {
    const value         = values[i];
    const encoded       = encoder.encode(value);
    const chunks        = split(encoded, { shares, quorum });
    const reconstructed = combine(chunks);
    const decoded       = decoder.decode(reconstructed || new Uint8Array(0));
    t.equal(decoded, value, `Random value en-/decoding test ${value}`);
  }
});

test('Hinted reconstruction test', t => {
  t.plan(1);

  // Prepare data
  const original = "Hello World!";
  const data     = encoder.encode(original);

  // Configuration of this example
  const shares = 8;
  const quorum = 5;

  // Generate FEC chunks
  let chunks = split(data, { shares, quorum });

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

  t.equal(decoded, original, 'Data is succesfully reconstructed');
});
