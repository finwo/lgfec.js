import * as test from 'tape';
import { split, combine, splitExact, combineExact } from '../src/main';

test('Loose encoding/decoding test', t => {
  t.plan(1);

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

  t.equal(decoded, original + '\0\0\0', 'Data is returned as expected');
});

test('Exact encoding/decoding test', t => {
  t.plan(1);

  // Prepare data
  const original = "Hello World!";
  const encoder  = new TextEncoder();
  const decoder  = new TextDecoder();
  const data     = encoder.encode(original);

  // Configuration of this example
  const shares = 8;
  const quorum = 5;

  // Generate FEC chunks
  let chunks = splitExact(data, shares, quorum);

  // Delete chunks, keep {quorum}
  delete chunks[2];
  delete chunks[4];
  delete chunks[6];
  chunks = Object.values(chunks);

  // Reconstruct the original
  const reconstructed = combineExact(chunks);
  if (!reconstructed) {
    throw new Error("Error during combining chunks");
  }

  // Get back a string
  const decoded = decoder.decode(reconstructed);

  t.equal(decoded, original, 'Data is returned as expected');
});
