// Reproduit exactement kotlin.random.Random(seed) (XorWow) et String.hashCode() de Java,
// pour que les gigs, contrats et rencontres du jour soient les mêmes que sur le téléphone.
export function hashCode(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return h; }

export class KRandom {
  // seed : nombre entier (Long Kotlin). Les graines utilisées restent bien en dessous de 2^53.
  constructor(seed, isInt = false) {
    const lo = seed | 0, hi = isInt ? (lo >> 31) : Math.floor(seed / 4294967296) | 0;
    this.x = lo; this.y = hi; this.z = 0; this.w = 0; this.v = ~lo; this.addend = (lo << 10) ^ (hi >>> 4);
    for (let i = 0; i < 64; i++) this.nextInt();
  }
  nextInt() {
    let t = this.x; t ^= t >>> 2;
    this.x = this.y; this.y = this.z; this.z = this.w;
    const v0 = this.v; this.w = v0;
    t = (t ^ (t << 1)) ^ v0 ^ (v0 << 4); this.v = t | 0;
    this.addend = (this.addend + 362437) | 0;
    return (t + this.addend) | 0;
  }
  nextBits(n) { return n === 0 ? 0 : this.nextInt() >>> (32 - n); }
  nextIntUntil(n) {
    if ((n & -n) === n) return this.nextBits(31 - Math.clz32(n));
    let bits, v;
    do { bits = this.nextInt() >>> 1; v = bits % n; } while (((bits - v + (n - 1)) | 0) < 0);
    return v;
  }
  nextFloat() { return this.nextBits(24) / 16777216; }
  nextBoolean() { return this.nextBits(1) !== 0; }
  shuffled(list) { const a = [...list]; for (let i = a.length - 1; i >= 1; i--) { const j = this.nextIntUntil(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
}
export const R = (seed) => new KRandom(seed);
export const RInt = (seed) => new KRandom(seed, true);

// Jour local au format du téléphone (LocalDate) et numéro de jour (toEpochDay)
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function epochDay() { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
