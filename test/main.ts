import './0000-readme-usage';


// // --------[ TESTING ]--------
// import { randomBytes } from 'crypto';

// // 1 meg of data
// const shares                = 8;
// const quorum                = 5;
// const data                  = Uint8Array.from(randomBytes(2**16));
// let   encodeTimes: number[] = [];
// let   decodeTimes: number[] = [];
// let   damageTimes: number[] = [];

// const testStart = Date.now();
// let rounds = 0;

// // N rounds of testing
// while((Date.now() - testStart) < 10e3) {
//   rounds++;
//   const start = performance.now();
//   let   s     = split(data, shares, quorum);
//   const mid   = performance.now();
//   const d     = combine(s);
//   const end   = performance.now();

//   // Damage shares down to quorum
//   while(s.length > quorum) {
//     delete s[Math.floor(Math.random()*s.length)];
//     s = Object.values(s);
//   }

//   const pre = performance.now();
//   let D = combine(s);
//   const post = performance.now();

//   // Sanity check
//   if (Buffer.compare(Buffer.from(data),Buffer.from(d).subarray(0,data.byteLength)) !== 0) {
//     console.log( data, d.subarray(0,data.byteLength) );
//     throw new Error('Encountered error');
//   }

//   encodeTimes.push(mid-start);
//   decodeTimes.push(end-mid);
//   damageTimes.push(post-pre);
// }

// encodeTimes = encodeTimes.sort((a,b) => (a>b)?1:(a <b)?-1:0);
// decodeTimes = decodeTimes.sort((a,b) => (a>b)?1:(a <b)?-1:0);
// damageTimes = damageTimes.sort((a,b) => (a>b)?1:(a <b)?-1:0);

// function rtt(n: number) {
//   return ('      ' + n.toFixed(2)).substr(-6);
// }
// function mbytes(n: number) {
//   const base = (data.length * 1000) / 1024 / 1024;
//   const mibi = base / n;
//   return ('      ' + mibi.toFixed(2)).substr(-6);
// }

// const percentages = [1,5,50,95,99];

// const encodedRtt = percentages.map(p => rtt(encodeTimes[Math.floor(rounds * p / 100)]));
// const decodedRtt = percentages.map(p => rtt(decodeTimes[Math.floor(rounds * p / 100)]));
// const damagedRtt = percentages.map(p => rtt(damageTimes[Math.floor(rounds * p / 100)]));

// const encodedBw = percentages.map(p => mbytes(encodeTimes[Math.floor(rounds * p / 100)]));
// const decodedBw = percentages.map(p => mbytes(decodeTimes[Math.floor(rounds * p / 100)]));
// const damagedBw = percentages.map(p => mbytes(damageTimes[Math.floor(rounds * p / 100)]));

// process.stdout.write(`64KiB blocks, ${shares} shares, ${quorum} quorum, tested ${rounds} rounds\n`);
// process.stdout.write('  +----------------------+' + '--------+'.repeat(percentages.length) + '\n');
// process.stdout.write('  | Percentile           | ' + percentages.map(p => (' '.repeat(5) + p.toFixed(0)).substr(-6)).join(' | ') + ' |\n' );
// process.stdout.write('  +----------------------+' + '--------+'.repeat(percentages.length) + '\n');
// process.stdout.write('  | Encode         RTT   | ' + encodedRtt.join(' | ') + ' |\n');
// process.stdout.write('  | Decode         RTT   | ' + decodedRtt.join(' | ') + ' |\n');
// process.stdout.write('  | Damaged Decode RTT   | ' + damagedRtt.join(' | ') + ' |\n');
// process.stdout.write('  | Encode         MiB/s | ' + encodedBw.join(' | ') + ' |\n');
// process.stdout.write('  | Decode         MiB/s | ' + decodedBw.join(' | ') + ' |\n');
// process.stdout.write('  | Damaged Decode MiB/s | ' + damagedBw.join(' | ') + ' |\n');
// process.stdout.write('  +----------------------+' + '--------+'.repeat(percentages.length) + '\n');

