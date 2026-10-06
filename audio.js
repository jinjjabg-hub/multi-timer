// 소리·진동·화면 유지 공통 모듈
let ac = null;
export function unlock() {
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) {}
}
function tone(t0, f, d, type, vol) {
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = f; o.connect(g); g.connect(ac.destination);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + .01); g.gain.exponentialRampToValueAtTime(.001, t0 + d);
  o.start(t0); o.stop(t0 + d + .05);
}
export function beep(d = .15, f = 880) { unlock(); if (ac) tone(ac.currentTime, f, d, 'sine', .25); }
const BELLS = [
  t => [880, 1109, 1319].forEach((f, i) => tone(t + i * .18, f, .9, 'sine', .35)),
  t => { tone(t, 196, 2, 'sine', .5); tone(t, 392, 1.6, 'triangle', .2); tone(t, 588, 1.2, 'sine', .1); },
  t => { for (let i = 0; i < 4; i++) tone(t + i * .15, 1200, .1, 'square', .18); },
  t => { tone(t, 440, .9, 'sawtooth', .25); tone(t + .05, 445, .85, 'sawtooth', .2); }
];
export function playBell(n) { unlock(); if (ac) BELLS[n | 0](ac.currentTime + .02); }
let timer = 0;
export function ring(n) { playBell(n); let c = 1; clearInterval(timer); timer = setInterval(() => { if (++c > 3) clearInterval(timer); else playBell(n); }, 2200); }
export function stopRing() { clearInterval(timer); }
export function vib() { try { navigator.vibrate && navigator.vibrate([400, 150, 400, 150, 400]); } catch (e) {} }

let lock = null;
export async function wakeLock(on) {
  try {
    if (on && 'wakeLock' in navigator) lock = await navigator.wakeLock.request('screen');
    else if (lock) { await lock.release(); lock = null; }
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && lock !== null) wakeLock(true); });

export const fmt = s => { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
export const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
