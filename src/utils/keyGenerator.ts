/**
 * Function to generate a Charles license key
 * @param name The registered name to generate a key for
 * @returns Promise that resolves to the generated license key
 */
export async function generateKey(name: string): Promise<string> {
  try {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = crack(name);
        resolve(key);
      }, 300);
    });
  } catch (error) {
    throw new Error('Failed to generate key');
  }
}

const rounds = 12;
const roundKeys = 2 * (rounds + 1);

function crack(text: string): string {
  const name = new TextEncoder().encode(text);
  const length = name.length + 4;
  const padded = ((-length) & (8 - 1)) + length;
  const bs = new Uint8Array(4);
  new DataView(bs.buffer).setUint32(0, name.length, false); // big endian
  const buff = new Uint8Array(padded);
  buff.set(bs, 0);
  buff.set(name, 4);

  const ckName = BigInt("0x7a21c951691cd470");
  const ckKey = BigInt("-5408575981733630035");
  const ck = newCkCipher(ckName);

  const outBuff = [];
  for (let i = 0; i < padded; i += 8) {
    const bf = buff.slice(i, i + 8);
    let nowVar = new DataView(bf.buffer).getBigInt64(0, false); // big endian
    let dd = ck.encrypt(nowVar);
    for (let j = 7; j >= 0; j--) {
      outBuff.push(Number((dd >> BigInt(j * 8)) & BigInt(0xff)));
    }
  }

  let n = 0;
  for (const b of outBuff) {
    n = rotateLeft32(n ^ (b << 24 >> 24), 0x3);
  }
  const prefix = n ^ 0x54882f8a;
  let suffix = Math.floor(Math.random() * 0x7fffffff);
  let inVal = (BigInt(prefix) << 32n);
  let s = BigInt(suffix);
  switch (suffix >> 16) {
    case 0x0401:
    case 0x0402:
    case 0x0403:
      inVal |= s;
      break;
    default:
      inVal |= BigInt(0x01000000) | (s & BigInt(0xffffff));
      break;
  }
  const out = newCkCipher(ckKey).decrypt(inVal);

  let n2 = 0n;
  for (let i = 56; i >= 0; i -= 8) {
    n2 ^= (inVal >> BigInt(i)) & 0xffn;
  }
  let vv = Number(n2 & 0xffn);
  if (vv < 0) vv = -vv;
  return `${vv.toString(16).padStart(2, "0")}${out.toString(16).padStart(16, "0")}`;
}

function newCkCipher(ckKey: bigint) {
  const rk = new Array(roundKeys).fill(0);
  let ld = [Number(ckKey & 0xffffffffn) | 0, Number((ckKey >> 32n) & 0xffffffffn) | 0];
  rk[0] = -1209970333;
  for (let i = 1; i < roundKeys; i++) {
    rk[i] = (rk[i - 1] + -1640531527) | 0;
  }
  let a = 0, b = 0, i = 0, j = 0;
  for (let k = 0; k < 3 * roundKeys; k++) {
    rk[i] = rotateLeft32((rk[i] + (a + b)) | 0, 3);
    a = rk[i];
    ld[j] = rotateLeft32((ld[j] + (a + b)) | 0, (a + b));
    b = ld[j];
    i = (i + 1) % roundKeys;
    j = (j + 1) % 2;
  }
  return {
    encrypt: function (input: bigint) {
      let a = Number(input & 0xffffffffn) + rk[0];
      let b = Number((input >> 32n) & 0xffffffffn) + rk[1];
      a |= 0; b |= 0;
      for (let r = 1; r <= rounds; r++) {
        a = (rotateLeft32((a ^ b), b) + rk[2 * r]) | 0;
        b = (rotateLeft32((b ^ a), a) + rk[2 * r + 1]) | 0;
      }
      return pkLong(a, b);
    },
    decrypt: function (input: bigint) {
      let a = Number(input & 0xffffffffn) | 0;
      let b = Number((input >> 32n) & 0xffffffffn) | 0;
      for (let i = rounds; i > 0; i--) {
        b = rotateRight32((b - rk[2 * i + 1]) | 0, a) ^ a;
        a = rotateRight32((a - rk[2 * i]) | 0, b) ^ b;
      }
      b = (b - rk[1]) | 0;
      a = (a - rk[0]) | 0;
      return pkLong(a, b);
    }
  };
}

function rotateLeft32(x: number, y: number): number {
  y &= 31;
  return ((x << y) | (x >>> (32 - y))) | 0;
}

function rotateRight32(x: number, y: number): number {
  y &= 31;
  return ((x >>> y) | (x << (32 - y))) | 0;
}

function pkLong(a: number, b: number): bigint {
  return (BigInt(a >>> 0) | (BigInt(b >>> 0) << 32n));
}