function s(o) {
  let t = 0;
  const e = o.length, r = 2147483648;
  for (let n = 0; n < e; n++)
    t = 31 * t + o.charCodeAt(n), t > 2147483647 && (t %= r);
  return t;
}
function d(o, t, e) {
  let r = "", n = t;
  const a = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  o && (n = Math.round(Math.random() * (e - t)) + t);
  for (let h = 0; h < n; h++) {
    const c = Math.round(Math.random() * (a.length - 1));
    r += a[c];
  }
  return r;
}
function l() {
  const o = (/* @__PURE__ */ new Date()).valueOf(), t = d(!1, 6, 29);
  return s(t + o.toString());
}
export {
  l as gethashcode
};
