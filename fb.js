// Firebase 공통 모듈 (multi-timer-fb095 프로젝트 전용. MANDU 프로젝트와 섞지 말 것)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot, getDocFromServer, serverTimestamp, Timestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyB3bq6wDyvDctDd62AyofXLaFLHKQm-Fog",
  authDomain: "multi-timer-fb095.firebaseapp.com",
  projectId: "multi-timer-fb095",
  storageBucket: "multi-timer-fb095.firebasestorage.app",
  messagingSenderId: "734201221637",
  appId: "1:734201221637:web:dab92039345abf9fdf026c",
  measurementId: "G-17NY7B6S6E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* 익명 로그인 */
let userP = null;
export function login() {
  if (!userP) userP = signInAnonymously(auth).then(c => c.user);
  userP.catch(() => { userP = null; });
  return userP;
}

/* 서버 시간 보정: 기기 시계와 서버 시계의 차이(offset)를 재서 serverNow()에 반영 */
let offset = 0;
export const serverNow = () => Date.now() + offset;
export async function syncClock() {
  const user = await login();
  const ref = doc(db, 'pings', user.uid);
  let best = null;
  for (let i = 0; i < 3; i++) {
    const t0 = Date.now();
    await setDoc(ref, { t: serverTimestamp() });
    const t1 = Date.now();
    const snap = await getDocFromServer(ref);
    const rtt = t1 - t0;
    if (!best || rtt < best.rtt) best = { rtt, off: snap.data().t.toMillis() - (t0 + t1) / 2 };
  }
  offset = best.off;
}

/* 방 */
const DAY = 24 * 3600 * 1000;
const stamp = () => ({ updatedAt: serverTimestamp(), expireAt: Timestamp.fromMillis(Date.now() + DAY) });
const roomRef = code => doc(db, 'rooms', code);

export async function createRoom({ slots, presenters, bell }) {
  const user = await login();
  for (let i = 0; i < 8; i++) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    try {
      await setDoc(roomRef(code), {
        ownerUid: user.uid, slots, presenters, bell,
        presenterIndex: 0, slotIndex: 0, status: 'idle',
        startedAt: null, runSec: 0, pausedRemainingSec: 0, ...stamp()
      });
      return code;
    } catch (e) {
      if (e.code !== 'permission-denied') throw e;   // 이미 있는 코드면 거부됨 → 다른 코드로 재시도
    }
  }
  throw new Error('방 코드를 만들지 못했습니다. 다시 시도하세요.');
}
export const patchRoom = (code, patch) => updateDoc(roomRef(code), { ...patch, ...stamp() });
export const startedStamp = () => serverTimestamp();

/* 구독: cb(room|null, {fromCache}) — startedAt은 밀리초 숫자(startedMs)로 변환해 전달 */
export function watchRoom(code, cb, onError) {
  return onSnapshot(roomRef(code), { includeMetadataChanges: true }, snap => {
    if (!snap.exists()) return cb(null, snap.metadata);
    const d = snap.data({ serverTimestamps: 'estimate' });
    d.startedMs = d.startedAt ? d.startedAt.toMillis() : 0;
    cb(d, snap.metadata);
  }, onError);
}

/* 남은 시간(초). 모든 기기가 같은 식으로 계산 */
export function remaining(r) {
  if (r.status === 'running') return r.runSec - (serverNow() - r.startedMs) / 1000;
  if (r.status === 'paused') return r.pausedRemainingSec;
  return r.slots[r.slotIndex].totalSec;
}
