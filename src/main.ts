import {AssertionError} from 'assert';
import { interpolatePolynomial, reconstruct } from './core';
import {crc16} from '@finwo/crc16-xmodem';
import {majority} from './util';

type SplitOptions = {
  shares: number;
  quorum: number;
  embedMeta?: boolean;
  embedCrc?: boolean;
};

/**
 * Splits a chunk of data into {shares} chunks requiring at least {quorum} chunks to reconstruct the original
 *
 * @param {Uint8Array} data -- The data to be encoded
 * @param {object} options  -- Encoding options, see SplitOptions type
 */
export function split(
  data: Uint8Array,
  options: SplitOptions
): Uint8Array[] {

  // Sanity checking
  if ('object' !== typeof options) throw new AssertionError({ message: "Given options must be a object", expected: "object", actual: typeof options });
  if (!options) throw new AssertionError({ message: "Given options is not an object", expected: "object", actual: 'null' });

  // Mix in defaults
  const opts: Required<SplitOptions> = Object.assign({
    embedMeta: true,
    embedCrc: true,
  }, options);

  // More option validation
  if ('boolean' !== typeof opts.embedMeta) throw new AssertionError({ message: "options.embedMeta must be a boolean", expected: "boolean", actual: typeof opts.embedMeta });
  if ('boolean' !== typeof opts.embedCrc) throw new AssertionError({ message: "options.embedCrc must be a boolean", expected: "boolean", actual: typeof opts.embedCrc });
  if ('number' !== typeof opts.shares) throw new AssertionError({ message: "options.shares must be a number", expected: "number", actual: typeof options.shares });
  if ('number' !== typeof opts.quorum) throw new AssertionError({ message: "options.quorum must be a number", expected: "number", actual: typeof options.quorum });
  if (options.shares <= 0) throw new AssertionError({ message: "options.shares must be positive", expected: "> 0", actual: typeof options.shares });
  if ('number' !== typeof opts.quorum) throw new AssertionError({ message: "options.quorum must be a number", expected: "number", actual: typeof options.quorum });
  if (options.shares < opts.quorum) throw new AssertionError({ message: "Amount of shares must be equal to or geater than the quorum" });

  // +4 = padding indicator reservation
  const chunkLength: number = Math.ceil((data.byteLength+4) / opts.quorum);
  const shareLength: number = chunkLength + (opts.embedMeta ? 2 : 0) + (opts.embedCrc ? 2 : 0);
  const result: Uint8Array[] = [];

  // Build intermediate with uint32be padding indicator
  const intermediate  = new Uint8Array(chunkLength * opts.quorum);
  const paddingLength = intermediate.byteLength - data.byteLength;
  intermediate.set(data);
  intermediate[intermediate.byteLength - 4] = (paddingLength >> 24) % 256;
  intermediate[intermediate.byteLength - 3] = (paddingLength >> 16) % 256;
  intermediate[intermediate.byteLength - 2] = (paddingLength >>  8) % 256;
  intermediate[intermediate.byteLength - 1] = (paddingLength >>  0) % 256;

  // Build initial chunks directly from data
  for (let i = 0; i < opts.shares; i++) {
    const share = new Uint8Array(shareLength);
    if (opts.embedMeta) {
      share[chunkLength]   = opts.quorum;
      share[chunkLength+1] = i;
    }
    share.set(intermediate.subarray(i*chunkLength, (i+1)*chunkLength));
    result.push(share);
  }

  // Build interpolated values
  const xSamples = new Uint8Array(opts.quorum).fill(0).map((_,i)=>i);
  const ySamples = new Uint8Array(opts.quorum).fill(0);
  for (let b = 0; b < chunkLength; b++) {
    for(let x=0; x < opts.quorum; x++) ySamples[x] = result[x][b];
    for(let j=opts.quorum; j < opts.shares; j++) {
      result[j][b] = interpolatePolynomial(xSamples, ySamples, j);
    }
  }

  // Embed CRC
  if (opts.embedCrc) {
    for (let i = 0; i < opts.shares; i++) {
      const crc = crc16(result[i]);
      result[i][shareLength-2] = (crc >> 8) % 256;
      result[i][shareLength-1] = (crc >> 0) % 256;
    }
  }

  return result;
}

type CombineOptions = {
  embeddedCrc: boolean;
} & ({
  embeddedMeta: true;
} | {
  embeddedMeta: false;
  quorum?: number;
});

/**
 * Combines `shares` to reconstruct the data.
 *
 * @param shares A list of shares to reconstruct the secret from. Must be at least 2 and at most 255.
 * @returns The reconstructed secret.
 */
export function combine(shares: Uint8Array[], options?: CombineOptions): Uint8Array|false {
  if (shares.length < 1) return false;

  const opts: CombineOptions = Object.assign({
    embeddedMeta: true,
    embeddedCrc: true,
  }, options);

  if ((!opts.embeddedMeta) && (!('quorum' in opts))) {
    throw new AssertionError({ message: "Quorum option must be given if metadata not embedded" });
  }

  // Validate lengths
  const shareLength = shares[0].byteLength;
  for(let i = 1 ; i < shares.length ; i++) {
    if (shares[i].byteLength !== shareLength) {
      throw new AssertionError({ message: "Only shares of equal length are supported" });
    }
  }

  // Build a map from share array index to chunk index
  let   maxShare      = -Infinity;
  const indexPosition = shareLength - 1 - (opts.embeddedCrc ? 2 : 0);
  const indexes       = new Uint8Array(shares.length);
  for(let i = 0 ; i < shares.length ; i++) {
    if (!shares[i]) continue;
    if (opts.embeddedMeta) indexes[i] = shares[i][indexPosition];
    else indexes[i] = i;
    maxShare = Math.max(indexes[i], maxShare);
  }

  // Validate shares
  const crcChecks = [];
  let   foundGood = 0;
  for(let i = 0 ; i < shares.length ; i++) {
    // Empty share = invalid
    if (!shares[i]) {
      crcChecks[i] = false;
      continue;
    }
    // Validate or assume
    if (opts.embeddedCrc) {
      crcChecks[i] = crc16(shares[i]) === 0;
      foundGood += crcChecks[i] ? 1 : 0;
    } else {
      crcChecks[i] = true; // Assume valid
      foundGood++;
    }
  }

  // Fetch quorum or majority vote from all shares
  const quorumPosition = shareLength - 2 - (opts.embeddedCrc ? 2 : 0);
  const quorum: number = 'quorum' in opts ? opts.quorum : majority(shares.filter(s=>s).map(a => a[quorumPosition]));
  if (shares.length < quorum) {
    return false;
  }

  // Let's rebuild the actual data
  const chunkLength = shareLength - (opts.embeddedMeta?2:0) - (opts.embeddedCrc?2:0);
  const data        = new Uint8Array(quorum * chunkLength);
  const xSamples    = indexes;
  const ySamples    = new Uint8Array(shares.length);
  for(let b=0 ; b < chunkLength; b++) {
    for(let i=0; i < shares.length; i++) {
      ySamples[i] = shares[i][b];
    }

    const slice = reconstruct(xSamples, ySamples, quorum, quorum, crcChecks);
    for(let i=0; i < quorum; i++) {
      data[b+(i*chunkLength)] = slice[i];
    }
  }

  // Remove padding & done
  const paddingLength =
    (data[data.byteLength - 4] << 24) +
    (data[data.byteLength - 3] << 16) +
    (data[data.byteLength - 2] <<  8) +
    (data[data.byteLength - 1] <<  0);
  return data.subarray(0, data.byteLength - paddingLength);
}
