// Provides log(X)/log(g) at each index X.
const LOG_TABLE: Readonly<Uint8Array> = new Uint8Array([
  0x00, 0xff, 0xc8, 0x08, 0x91, 0x10, 0xd0, 0x36, 0x5a, 0x3e, 0xd8, 0x43, 0x99, 0x77, 0xfe, 0x18,
  0x23, 0x20, 0x07, 0x70, 0xa1, 0x6c, 0x0c, 0x7f, 0x62, 0x8b, 0x40, 0x46, 0xc7, 0x4b, 0xe0, 0x0e,
  0xeb, 0x16, 0xe8, 0xad, 0xcf, 0xcd, 0x39, 0x53, 0x6a, 0x27, 0x35, 0x93, 0xd4, 0x4e, 0x48, 0xc3,
  0x2b, 0x79, 0x54, 0x28, 0x09, 0x78, 0x0f, 0x21, 0x90, 0x87, 0x14, 0x2a, 0xa9, 0x9c, 0xd6, 0x74,
  0xb4, 0x7c, 0xde, 0xed, 0xb1, 0x86, 0x76, 0xa4, 0x98, 0xe2, 0x96, 0x8f, 0x02, 0x32, 0x1c, 0xc1,
  0x33, 0xee, 0xef, 0x81, 0xfd, 0x30, 0x5c, 0x13, 0x9d, 0x29, 0x17, 0xc4, 0x11, 0x44, 0x8c, 0x80,
  0xf3, 0x73, 0x42, 0x1e, 0x1d, 0xb5, 0xf0, 0x12, 0xd1, 0x5b, 0x41, 0xa2, 0xd7, 0x2c, 0xe9, 0xd5,
  0x59, 0xcb, 0x50, 0xa8, 0xdc, 0xfc, 0xf2, 0x56, 0x72, 0xa6, 0x65, 0x2f, 0x9f, 0x9b, 0x3d, 0xba,
  0x7d, 0xc2, 0x45, 0x82, 0xa7, 0x57, 0xb6, 0xa3, 0x7a, 0x75, 0x4f, 0xae, 0x3f, 0x37, 0x6d, 0x47,
  0x61, 0xbe, 0xab, 0xd3, 0x5f, 0xb0, 0x58, 0xaf, 0xca, 0x5e, 0xfa, 0x85, 0xe4, 0x4d, 0x8a, 0x05,
  0xfb, 0x60, 0xb7, 0x7b, 0xb8, 0x26, 0x4a, 0x67, 0xc6, 0x1a, 0xf8, 0x69, 0x25, 0xb3, 0xdb, 0xbd,
  0x66, 0xdd, 0xf1, 0xd2, 0xdf, 0x03, 0x8d, 0x34, 0xd9, 0x92, 0x0d, 0x63, 0x55, 0xaa, 0x49, 0xec,
  0xbc, 0x95, 0x3c, 0x84, 0x0b, 0xf5, 0xe6, 0xe7, 0xe5, 0xac, 0x7e, 0x6e, 0xb9, 0xf9, 0xda, 0x8e,
  0x9a, 0xc9, 0x24, 0xe1, 0x0a, 0x15, 0x6b, 0x3a, 0xa0, 0x51, 0xf4, 0xea, 0xb2, 0x97, 0x9e, 0x5d,
  0x22, 0x88, 0x94, 0xce, 0x19, 0x01, 0x71, 0x4c, 0xa5, 0xe3, 0xc5, 0x31, 0xbb, 0xcc, 0x1f, 0x2d,
  0x3b, 0x52, 0x6f, 0xf6, 0x2e, 0x89, 0xf7, 0xc0, 0x68, 0x1b, 0x64, 0x04, 0x06, 0xbf, 0x83, 0x38,
]);

// Provides the exponentiation value at each index X.
const EXP_TABLE: Readonly<Uint8Array> = new Uint8Array([
  0x01, 0xe5, 0x4c, 0xb5, 0xfb, 0x9f, 0xfc, 0x12, 0x03, 0x34, 0xd4, 0xc4, 0x16, 0xba, 0x1f, 0x36,
  0x05, 0x5c, 0x67, 0x57, 0x3a, 0xd5, 0x21, 0x5a, 0x0f, 0xe4, 0xa9, 0xf9, 0x4e, 0x64, 0x63, 0xee,
  0x11, 0x37, 0xe0, 0x10, 0xd2, 0xac, 0xa5, 0x29, 0x33, 0x59, 0x3b, 0x30, 0x6d, 0xef, 0xf4, 0x7b,
  0x55, 0xeb, 0x4d, 0x50, 0xb7, 0x2a, 0x07, 0x8d, 0xff, 0x26, 0xd7, 0xf0, 0xc2, 0x7e, 0x09, 0x8c,
  0x1a, 0x6a, 0x62, 0x0b, 0x5d, 0x82, 0x1b, 0x8f, 0x2e, 0xbe, 0xa6, 0x1d, 0xe7, 0x9d, 0x2d, 0x8a,
  0x72, 0xd9, 0xf1, 0x27, 0x32, 0xbc, 0x77, 0x85, 0x96, 0x70, 0x08, 0x69, 0x56, 0xdf, 0x99, 0x94,
  0xa1, 0x90, 0x18, 0xbb, 0xfa, 0x7a, 0xb0, 0xa7, 0xf8, 0xab, 0x28, 0xd6, 0x15, 0x8e, 0xcb, 0xf2,
  0x13, 0xe6, 0x78, 0x61, 0x3f, 0x89, 0x46, 0x0d, 0x35, 0x31, 0x88, 0xa3, 0x41, 0x80, 0xca, 0x17,
  0x5f, 0x53, 0x83, 0xfe, 0xc3, 0x9b, 0x45, 0x39, 0xe1, 0xf5, 0x9e, 0x19, 0x5e, 0xb6, 0xcf, 0x4b,
  0x38, 0x04, 0xb9, 0x2b, 0xe2, 0xc1, 0x4a, 0xdd, 0x48, 0x0c, 0xd0, 0x7d, 0x3d, 0x58, 0xde, 0x7c,
  0xd8, 0x14, 0x6b, 0x87, 0x47, 0xe8, 0x79, 0x84, 0x73, 0x3c, 0xbd, 0x92, 0xc9, 0x23, 0x8b, 0x97,
  0x95, 0x44, 0xdc, 0xad, 0x40, 0x65, 0x86, 0xa2, 0xa4, 0xcc, 0x7f, 0xec, 0xc0, 0xaf, 0x91, 0xfd,
  0xf7, 0x4f, 0x81, 0x2f, 0x5b, 0xea, 0xa8, 0x1c, 0x02, 0xd1, 0x98, 0x71, 0xed, 0x25, 0xe3, 0x24,
  0x06, 0x68, 0xb3, 0x93, 0x2c, 0x6f, 0x3e, 0x6c, 0x0a, 0xb8, 0xce, 0xae, 0x74, 0xb1, 0x42, 0xb4,
  0x1e, 0xd3, 0x49, 0xe9, 0x9c, 0xc8, 0xc6, 0xc7, 0x22, 0x6e, 0xdb, 0x20, 0xbf, 0x43, 0x51, 0x52,
  0x66, 0xb2, 0x76, 0x60, 0xda, 0xc5, 0xf3, 0xf6, 0xaa, 0xcd, 0x9a, 0xa0, 0x75, 0x54, 0x0e, 0x01,
]);

function add(a: number, b: number): number {
  return a ^ b;
}

function div(a: number, b: number): number {
  // This should never happen
  if (b === 0) {
    throw new Error('cannot divide by zero');
  }
  const logA = LOG_TABLE[a]!;
  const logB = LOG_TABLE[b]!;
  const diff = (logA - logB + 255) % 255;
  const result = EXP_TABLE[diff]!;
  return a === 0 ? 0 : result;
}

function mult(a: number, b: number): number {
  const logA = LOG_TABLE[a]!;
  const logB = LOG_TABLE[b]!;
  const sum = (logA + logB) % 255;
  const result = EXP_TABLE[sum]!;
  return a === 0 || b === 0 ? 0 : result;
}

function interpolatePolynomial(xSamples: Uint8Array, ySamples: Uint8Array, x: number): number {
  const limit = xSamples.length;
  let basis = 0;
  let result = 0;
  for (let i = 0; i < limit; i++) {
    basis = 1;
    for (let j = 0; j < limit; ++j) {
      if (i === j) {
        continue;
      }
      const num = add(x, xSamples[j]!);
      const denom = add(xSamples[i]!, xSamples[j]!);
      const term = div(num, denom);
      basis = mult(basis, term);
    }
    result = add(result, mult(ySamples[i]!, basis));
  }
  return result;
}

/**
 * Splits a chunk of data into {shares} chunks requiring at least {quorum} chunks to reconstruct the original
 *
 * @param {Uint8Array} data -- The data to be encoded
 * @param {number} shares   -- How many shares to produce for the data
 * @param {number} quorum   -- Number of shares required to be reconstruct the data
 * @returns {Uint8Array[]} shares
 */
export function split(
  data: Uint8Array,
  shares: number,
  quorum: number,
): Uint8Array[] {
  const chunkLength: number = Math.ceil(data.byteLength / quorum);
  const result: Uint8Array[] = [];

  // Build initial chunks directly from data
  for (let i = 0; i < shares; i++) {
    const share = new Uint8Array(chunkLength + 2);
    share[chunkLength]   = quorum;
    share[chunkLength+1] = i;
    result.push(share);
  }
  for(let i=0; i < quorum; i++) {
    result[i].set(data.subarray(i*chunkLength, (i+1)*chunkLength));
  }

  // Build interpolated values
  const xSamples = new Uint8Array(quorum).fill(0).map((_,i)=>i);
  const ySamples = new Uint8Array(quorum).fill(0);
  for (let b = 0; b < chunkLength; b++) {
    for(let x=0; x < quorum; x++) ySamples[x] = result[x][b];
    for(let j=quorum; j < shares; j++) {
      result[j][b] = interpolatePolynomial(xSamples, ySamples, j);
    }
  }

  return result;
}

/**
 * Combines `shares` to reconstruct the data.
 *
 * @param shares A list of shares to reconstruct the secret from. Must be at least 2 and at most 255.
 * @returns The reconstructed secret.
 */
export function combine(shares: Uint8Array[]): Uint8Array|false {
  if (shares.length < 1) return false;

  const sharesLength = shares.length;
  const shareLength  = shares[0].byteLength;
  const chunkLength  = shareLength - 2;
  const quorum       = shares[0][chunkLength];
  if (shareLength < 1) return false;
  if (sharesLength < quorum) return false;

  const xSamples = new Uint8Array(quorum).map((_,i)=>shares[i][shareLength-1]);
  const ySamples = new Uint8Array(quorum);
  const data     = new Uint8Array(quorum * chunkLength);
  const has      = {};

  for(const share of shares) {
    const chunk = share[shareLength-1];
    has[chunk] = true;
    if (chunk >= quorum) continue;
    data.set(share.subarray(0,chunkLength), chunkLength * chunk);
  }

  for(let b=0; b < chunkLength; b++) {
    for(let i=0; i < quorum; i++) ySamples[i] = shares[i][b];
    for(let i=0; i < quorum; i++) {
      if (has[i]) continue;
      data[b+(i*chunkLength)] = interpolatePolynomial(xSamples, ySamples, i);
    }
  }
  return data;
}

export function splitExact(
  data: Uint8Array,
  shares: number,
  quorum: number,
): Uint8Array[] {
  const length       = data.byteLength;
  const intermediate = new Uint8Array(length + 4);
  intermediate.set(data, 4);
  intermediate[0] = length >> 24;
  intermediate[1] = length >> 16;
  intermediate[2] = length >>  8;
  intermediate[3] = length;
  return split(intermediate, shares, quorum);
}

export function combineExact(shares: Uint8Array[]): Uint8Array|false {
  if (shares.length < 1) return false;
  const reconstructed = combine(shares);
  if (!reconstructed) return false;
  if (reconstructed.byteLength < 4) return false;
  const length =
    (reconstructed[0] << 24) +
    (reconstructed[1] << 16) +
    (reconstructed[2] <<  8) +
    (reconstructed[3]      );
  if (length > (reconstructed.byteLength - 4)) return false;
  return reconstructed.subarray(4, length + 4);
}
