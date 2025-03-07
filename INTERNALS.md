# Concept

Note: Chunks are processed as columns, byte for byte.

## Splitting

### Data preparation

Data is first appended with a 4 null-bytes, reserved as space for indicating the
padding applied to the last chunk after splitting.

Afterwards, the data is split into #quorum chunks, and #shares-#quorum empty
chunks are generated for the purpose of redundancy.

To each chunk, a suffix is added to contain optional extra data for each chunk.

The suffix size depends on the options given to the split method. The
`includeMeta` and `includeCrc` each add 2 bytes to the chunk suffix. This suffix
will be filled after calculating the redundancy data.

### Calculating

For each column/byte of the chunks, excluding the suffix, the bytes are used as
data points in the polynomial interpolation, using the chunk number as their X
coordinate.

After generating the coordinate map, the X for the empty chunks are plugged in
to generate the contents of the previously empty chunks.

### Filling the suffix

Within the suffix, first comes the 1-byte quorum indicator, then the 1-byte
chunk index, followed by the 2-byte CRC. The quorum indicator and chunk index
are controlled by the `includeMeta` flag, and the CRC field is controlled by the
`includeCrc` flag.

The quorum indicator is simply the number passed into the split method
unaltered.

The chunk index should be self-explanatory. This is a 1-byte indicator that
matches the index of the chunk as returned in the array from the split method.

The CRC is a [CRC16-XMODEM](https://crccalc.com/?method=CRC-16/XMODEM), which
is basically just a 2-byte check to guide the reconstruction of data if anything
fails, and is calculated and inserted last.

## Reconstructing

TODO

- crc-check all given chunks
- quorum valid chunks given = use those
- extra chunks = double-check if it generates the same data => valid is done
- invalid chunks with valid crc = generate all combinations and use majority vote for column

Original:
  D: 1
  D: 2
  R: 3
  R: 4
  R: 5

Erasure = fine:
  D: 2
  R: 3..5

Corrupt = majority vote:

22345

22 ,      22222
 23,      12345
  34,     12345
   45,    12345





















