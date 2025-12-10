/* -----------------------------------------
   utils.js – Firebase + دوال عامة + ترقيم الفواتير
------------------------------------------*/

// نعتمد على window.db القادم من index.html
// db هو Firestore instance (firebase.firestore())

function isOnline() {
  return navigator.onLine;
}

// رقم تسلسلي داخلي للفواتير (خانتين)
function getLocalInvoiceCounter(){
  let n = Number(localStorage.getItem("local-invoice-counter") || "0");
  n++;
  if(n > 99) n = 1;
  localStorage.setItem("local-invoice-counter", n);
  return String(n).padStart(2, "0");
}

// رقم فاتورة منسوب للوقت YYMMDDHHmm + حالة الاتصال + SS
function generateInvoiceNumber(){
  const d = new Date();
  const YY = String(d.getFullYear()).slice(-2);
  const MM = String(d.getMonth()+1).padStart(2,"0");
  const DD = String(d.getDate()).padStart(2,"0");
  const HH = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  const C = isOnline() ? "1" : "0";
  const SS = getLocalInvoiceCounter();
  return `${YY}${MM}${DD}${HH}${mm}${C}${SS}`;
}

// تنسيق رقم
function fnum(n) {
  return Number(n || 0).toFixed(2);
}

// تاريخ اليوم ISO
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ----------------- Firebase Helpers ----------------- */

// قراءة مجموعة كاملة من Firestore
async function firebaseGetCollection(colName) {
  const snap = await db.collection(colName).get();
  return snap.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
}

// إضافة مستند إلى مجموعة
async function firebaseAdd(colName, dataObject = {}) {
  await db.collection(colName).add(dataObject);
  return { status: "success" };
}

/* Offline Helpers */

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* DOM Helpers */

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

function create(tag, cls = "") {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
}
