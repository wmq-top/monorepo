var oe = Object.defineProperty;
var re = (v, e, t) => e in v ? oe(v, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : v[e] = t;
var M = (v, e, t) => (re(v, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as Q, ref as N, toRefs as U, computed as L, watch as B, onMounted as X, createVNode as h, Fragment as V, createTextVNode as G } from "vue";
import { Input as ue, Tree as ce, message as j, Button as J } from "ant-design-vue";
import { PlusSquareOutlined as ie, MinusSquareOutlined as de } from "@ant-design/icons-vue";
import "ant-design-vue/dist/antd.css";
class ve {
  static getKeysOfObject(e) {
    return Object.keys(e);
  }
  static deleteKey(e, t) {
    return Reflect.deleteProperty(e, t), e;
  }
  static getDeleteKeyRes(e, t, o) {
    if (o)
      return Reflect.deleteProperty(e, t), e;
    {
      const s = { ...e };
      return Reflect.deleteProperty(s, t), s;
    }
  }
}
class k {
  static buildTree(e, t = this.defaultParams, o = this.defaultRootInfo) {
    return !e || e.length === 0 ? [] : e.map((s, u) => {
      var g;
      const p = [...o.prevArr];
      u === e.length - 1 ? p.push(!1) : p.push(!0);
      const f = {
        title: s[t.name],
        id: s[t.id],
        level: o.level,
        onlyKey: `${o.onlyKey}-${u}`,
        key: `${o.onlyKey}-${u}`,
        parentId: o.parentId,
        parentNode: o.parentNode,
        // isLeaf: false || !item[fieldParams.children] || item[fieldParams.children]?.length === 0,
        isLeaf: !1,
        isRealLeaf: !s[t.children] || ((g = s[t.children]) == null ? void 0 : g.length) === 0,
        prevArr: [...o.prevArr, !0],
        dataDetail: ve.getDeleteKeyRes(s, t.children)
      }, w = {
        level: o.level + 1,
        onlyKey: `${o.onlyKey}-${u}`,
        prevArr: p,
        parentId: s[t.id],
        parentNode: { ...f }
      };
      return {
        ...f,
        children: this.buildTree(s[t.children], t, w)
      };
    });
  }
  static getNodePath(e, t = "title") {
    const o = [];
    let s = { ...e };
    for (; s; )
      o.push(s[t]), s = s.parentNode;
    return o.reverse();
  }
  static getNodeData(e, t, o = "onlyKey") {
    var u;
    const s = e.filter((p) => t.startsWith(p[o]));
    return s[0] ? ((u = s[0]) == null ? void 0 : u.onlyKey) === t ? s[0] : this.getNodeData(s[0].children, t) : null;
  }
  static getTreeConstruct(e, t) {
    const { fieldKey: o, connectKey: s, rootKeyValue: u } = { ...this.defaultConstructOptions, ...t }, p = [], f = /* @__PURE__ */ new Map();
    return e.forEach((g) => {
      g[s] === u ? p.push({ ...g }) : f.set(g[o], g);
    }), p.map((g) => ({
      ...g,
      children: this.getChildren(f, g[o], o, s)
    }));
  }
  static getChildren(e, t, o, s) {
    const u = [];
    return Array.from(e.values()).forEach((f) => {
      f[s] === t && u.push(f);
    }), u.length === 0 ? [] : (u.forEach((f) => {
      e.delete(f[o]);
    }), u.map((f) => ({
      ...f,
      children: this.getChildren(e, f[o], o, s)
    })));
  }
  static getAllNodeKeys(e, t = "onlyKey") {
    const o = { keys: [], nodes: /* @__PURE__ */ new Map() }, s = (u) => {
      !u || u.length === 0 || u.forEach((p) => {
        o.keys.push(p[t]), o.nodes.set(p[t], p), s(p.children);
      });
    };
    return s(e), o;
  }
}
M(k, "defaultParams", {
  name: "name",
  children: "children",
  id: "id"
}), M(k, "defaultRootInfo", {
  level: 0,
  onlyKey: "0",
  parentId: "root",
  parentNode: null,
  prevArr: []
}), M(k, "defaultConstructOptions", {
  fieldKey: "id",
  connectKey: "parentId",
  rootKeyValue: "root"
});
function pe(v) {
  let e = 0;
  const t = v.length, o = 2147483648;
  for (let s = 0; s < t; s++)
    e = 31 * e + v.charCodeAt(s), e > 2147483647 && (e %= o);
  return e;
}
function ye(v, e, t) {
  let o = "", s = e;
  const u = [
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
  v && (s = Math.round(Math.random() * (t - e)) + e);
  for (let p = 0; p < s; p++) {
    const f = Math.round(Math.random() * (u.length - 1));
    o += u[f];
  }
  return o;
}
function he() {
  const v = (/* @__PURE__ */ new Date()).valueOf(), e = ye(!1, 6, 29);
  return pe(e + v.toString());
}
const Y = {
  immediate: !1,
  mode: "locating",
  targetList: ["title"],
  placeHolder: "please input search"
}, fe = {
  scrollHeight: {
    type: String,
    default: "auto"
  },
  treeData: {
    type: Array,
    default: []
  },
  fieldParams: {
    type: Object,
    default: { name: "name", id: "id", children: "children" }
  },
  isFlatData: {
    type: Boolean,
    default: !1
  },
  checkable: {
    type: Boolean,
    default: !1
  },
  checkedKeys: {
    type: Array,
    default: []
  },
  checkStrictly: {
    type: Boolean,
    default: !1
  },
  expandKeys: {
    type: Array,
    default: []
  },
  withSearch: {
    type: Boolean,
    default: !1
  },
  searchOptions: {
    type: Object,
    default: Y
  }
}, ge = {
  change: () => !0,
  expand: (v, e, t) => !0,
  check: (v, e, t) => !0,
  select: (v, e, t) => !0
};
const we = /* @__PURE__ */ Q({
  name: "W3Login",
  props: fe,
  emits: ge,
  setup(v, {
    emit: e,
    slots: t,
    expose: o
  }) {
    const s = N(`${he()}`), {
      treeData: u,
      fieldParams: p,
      scrollHeight: f,
      checkable: w,
      checkedKeys: g,
      expandKeys: S,
      withSearch: P,
      searchOptions: A
    } = U(v), C = N(), K = L(() => k.buildTree(u.value, p.value)), O = L(() => Array.from(k.getAllNodeKeys(K.value).nodes.values())), E = N(), T = L(() => ({
      ...Y,
      ...A.value
    })), m = N([]), i = N({
      keys: [],
      nodes: /* @__PURE__ */ new Map()
    }), _ = (n, {
      expanded: c,
      node: d
    }) => {
      i.value.keys = n, c ? i.value.nodes.set(d.id, d.dataRef) : i.value.nodes.delete(d.id), e("expand", d.dataRef, c, {
        keys: [...i.value.keys],
        nodes: [...i.value.nodes.values()]
      });
    }, D = async () => (m.value.length !== 0 ? (i.value.keys = k.getAllNodeKeys(m.value, "id").keys, i.value.nodes = k.getAllNodeKeys(m.value, "id").nodes) : m.value.length === 0 && (i.value.keys = k.getAllNodeKeys(K.value, "id").keys, i.value.nodes = k.getAllNodeKeys(K.value, "id").nodes), {
      keys: [...i.value.keys],
      nodes: [...i.value.nodes.values()]
    }), l = async () => (i.value.keys = [], i.value.nodes = /* @__PURE__ */ new Map(), {
      keys: [...i.value.keys],
      nodes: [...i.value.nodes.values()]
    }), r = (n = "keys") => n === "keys" ? [...i.value.keys] : [...i.value.nodes.values()], a = N({
      keys: [],
      nodes: []
    }), b = (n, {
      checked: c,
      checkedNodes: d,
      node: y
    }) => {
      a.value.keys = n, a.value.nodes = d, e("check", y.dataRef, c, a.value);
    }, R = async () => w.value ? (m.value.length !== 0 ? (a.value.keys = k.getAllNodeKeys(m.value, "id").keys, a.value.nodes = Array.from(k.getAllNodeKeys(m.value, "id").nodes.values())) : m.value.length === 0 && (a.value.keys = k.getAllNodeKeys(K.value, "id").keys, a.value.nodes = Array.from(k.getAllNodeKeys(K.value, "id").nodes.values())), {
      keys: [...a.value.keys],
      nodes: [...a.value.nodes]
    }) : {
      keys: [],
      nodes: []
    }, W = async () => (a.value.keys = [], a.value.nodes = [], {
      keys: [...a.value.keys],
      nodes: [...a.value.nodes]
    }), Z = async () => a.value, z = (n, c) => {
      if (c === "check" && (a.value.nodes = O.value.filter((d) => n.includes(d.id))), c === "expand") {
        const d = /* @__PURE__ */ new Map();
        O.value.forEach((y) => {
          n.includes(y.id) && d.set(y.id, y);
        }), i.value.nodes = d;
      }
    }, I = N(""), $ = N({
      keys: [],
      nodes: []
    }), ee = (n, {
      selected: c,
      selectedNodes: d,
      node: y
    }) => {
      $.value.keys = n, $.value.nodes = d, I.value = "", e("select", y, c, $.value);
    }, te = (n, c, d) => {
      const y = O.value.find((x) => x.id === n);
      if (!y) {
        j.warning("当前定位的节点不存在~");
        return;
      }
      c ? i.value.keys = Array.from(/* @__PURE__ */ new Set([...k.getNodePath(y, "id"), ...i.value.keys])) : i.value.keys = k.getNodePath(y, "id"), z(i.value.keys, "expand"), $.value = {
        keys: [],
        nodes: []
      }, setTimeout(() => {
        var x;
        (x = C.value) == null || x.scrollTo({
          key: n,
          align: "top",
          offset: d || 30
        }), I.value = n;
      });
    };
    B(() => g.value, () => {
      a.value.keys = g.value, z(a.value.keys, "check");
    }, {
      deep: !0,
      immediate: !0
    }), B(() => S.value, () => {
      i.value.keys = S.value, z(i.value.keys, "expand");
    }, {
      deep: !0,
      immediate: !0
    });
    const F = N(500), le = () => new ResizeObserver((c) => {
      F.value = c[0].contentRect.height;
    }), se = () => {
      const n = document.getElementsByClassName("custom-tree-wrapper");
      let c = null;
      for (const d of Array.from(n))
        d.attributes["data-hash"].value === s.value && (c = d);
      le().observe(c);
    };
    X(() => {
      se();
    });
    const H = () => {
      l(), W();
      const n = O.value.filter((y) => {
        var x;
        return (x = T.value.targetList) == null ? void 0 : x.some((ne) => {
          var q;
          return (q = y[ne]) == null ? void 0 : q.includes(E.value);
        });
      });
      if (n.length === 0) {
        j.config({
          maxCount: 3
        }), j.warning({
          content: "没有匹配的节点~"
        });
        return;
      }
      const c = /* @__PURE__ */ new Set(), d = [];
      n.forEach((y) => {
        if (!y)
          return;
        let x = {
          ...y
        };
        for (; x; ) {
          if (c.has(x.onlyKey))
            return;
          c.add(x.onlyKey), d.push(x), x = x.parentNode;
        }
      }), m.value = k.buildTree(k.getTreeConstruct(d, {
        connectKey: "parentId",
        rootKeyValue: "root"
      }), p.value), D();
    }, ae = (n) => {
      var c;
      E.value = (c = n.target) == null ? void 0 : c.value, E.value || (m.value = []), T.value.immediate && H();
    };
    return o({
      expandAllNode: D,
      closedAllNode: l,
      getAllExpandNodes: r,
      checkedAllNode: R,
      disCheckedAllNode: W,
      getAllCheckedNode: Z,
      scrollTo: te
    }), () => h("div", {
      class: "custom-tree-content"
    }, [P.value && h(ue, {
      value: E.value,
      onChange: ae,
      onPressEnter: H,
      placeholder: T.value.placeHolder
    }, null), h("div", {
      class: "custom-tree-wrapper",
      "data-hash": s.value
    }, [h(ce, {
      ref: C,
      class: "custom-tree",
      fieldNames: {
        key: "id"
      },
      treeData: m.value.length === 0 ? K.value : m.value,
      height: f.value === "auto" ? F.value : Number(f.value),
      checkable: w.value,
      checkedKeys: a.value.keys,
      onCheck: (n, {
        checked: c,
        checkedNodes: d,
        node: y
      }) => b(n, {
        checked: c,
        checkedNodes: d,
        node: y
      }),
      expandedKeys: i.value.keys,
      onExpand: (n, {
        expanded: c,
        node: d
      }) => _(n, {
        expanded: c,
        node: d
      }),
      selectedKeys: $.value.keys,
      onSelect: ee
    }, {
      switcherIcon: ({
        dataRef: n,
        expanded: c
      }) => h(V, null, [[...new Array(n.level)].map((d, y) => h("span", {
        class: `self-indent ${n.prevArr[y + 1] ? "show-line" : ""}`
      }, null)), h("span", {
        class: `${n.level === "0" ? "root-icon" : "expand-icon"}`
      }, [!c && !n.isRealLeaf && h(ie, {
        class: "custom-svg-icon",
        style: {
          color: "#878988"
        }
      }, null), c && !n.isRealLeaf && h(de, {
        class: "custom-svg-icon",
        style: {
          color: "#878988"
        }
      }, null), n.isRealLeaf && h("span", {
        class: "last-self-indent"
      }, null)])]),
      title: ({
        dataRef: n
      }) => h(V, null, [h("span", {
        class: I.value === n.id ? "custom-title pre-focus" : "custom-title"
      }, [t.tag ? t.tag({
        dataRef: n
      }) : "", h("span", {
        class: "custom-title-item"
      }, [t.title ? t.title({
        dataRef: n
      }) : n.title]), t.operate ? t.operate({
        dataRef: n
      }) : ""])])
    })])]);
  }
}), me = {
  text: {
    type: String,
    default: "step Tips text"
  },
  position: {
    type: String,
    default: "bottom"
  },
  stepKey: {
    type: String,
    default: "1"
  },
  activeKey: {
    type: String,
    default: "1"
  },
  tipBoxStyle: {
    type: Object,
    default: {
      minWidth: "200px",
      maxWidth: "400px",
      border: "1.5px dashed #1890ff"
    }
  },
  withMask: {
    type: Boolean,
    default: !0
  },
  // staging props for develop user,make stepTips more stable
  scrollRef: {
    type: Object,
    default: null
  }
}, ke = {
  next: (v) => !0,
  jump: () => !0
};
const Se = /* @__PURE__ */ Q({
  name: "StepTips",
  props: me,
  emits: ke,
  setup(v, {
    emit: e,
    slots: t
  }) {
    const {
      stepKey: o,
      activeKey: s,
      position: u,
      tipBoxStyle: p,
      text: f,
      scrollRef: w
    } = U(v), g = L(() => o.value === s.value), S = N(), P = N(null), A = N(), C = N(), K = N(), O = (l) => {
      const r = [], a = {
        left: 1 / 0,
        top: 1 / 0,
        right: -1 / 0,
        bottom: -1 / 0
      };
      for (const b of l)
        getComputedStyle(b).position === "static" && r.push(b.getClientRects()[0]);
      return r.length === 0 ? null : (r.forEach((b) => {
        a.left = Math.min(a.left, b.left), a.top = Math.min(a.top, b.top), a.right = Math.max(a.right, b.right), a.bottom = Math.max(a.bottom, b.bottom);
      }), a);
    }, E = (l) => {
      var a;
      const r = (a = A.value) == null ? void 0 : a.getClientRects()[0];
      !A.value || !r || (u.value === "bottom" && (A.value.style.top = `${l.bottom + 8}px`, A.value.style.left = `${(l.right + l.left - r.width) / 2}px`), u.value === "top" && (A.value.style.top = `${l.top - r.height - 8}px`, A.value.style.left = `${(l.right + l.left - r.width) / 2}px`), u.value === "left" && (A.value.style.top = `${(l.top + l.bottom - r.height) / 2}px`, A.value.style.left = `${l.left - r.width - 8}px`), u.value === "right" && (A.value.style.top = `${(l.top + l.bottom - r.height) / 2}px`, A.value.style.left = `${l.right + 8}px`));
    }, T = (l) => {
      const r = document.createElement("div"), a = l.top > 8, b = l.left > 8;
      return r.className = "step-box-range-cover", r.style.height = `${a ? l.bottom - l.top + 8 : l.bottom - l.top}px`, r.style.width = `${b ? l.right - l.left + 8 : l.right - l.left}px`, r.style.position = "fixed", r.style.zIndex = "999", r.style.backgroundColor = "white", r.style.top = `${a ? l.top - 4 : l.top}px`, r.style.left = `${b ? l.left - 4 : l.left}px`, r.style.border = "1px solid skyblue", E(l), r;
    }, m = () => {
      var b, R;
      const l = (b = S.value) == null ? void 0 : b.children;
      if (!l)
        return;
      const r = O(l);
      if (!r) {
        console.warn("StepTips can't use to wrap Elements without any 'static' position", ["geeker-q/component", "StepTips.ts"]);
        return;
      }
      const [a] = document.getElementsByTagName("body");
      (R = document.getElementsByClassName("step-box-range-cover")[0]) == null || R.remove(), a.appendChild(T(r));
    }, i = () => new ResizeObserver(() => {
      m();
    }), _ = () => {
      e("next", String(Number(o.value) + 1));
    }, D = () => {
      e("jump");
    };
    return B(() => S.value, () => {
      S.value && (K.value = i(), K.value.observe(S.value)), m();
    }), X(() => {
      C.value = i(), C.value.observe(document.body), window.addEventListener("scroll", () => {
        m();
      });
    }), B(() => g.value, () => {
      var l, r, a;
      g.value || ((l = document.getElementsByClassName("step-box-range-cover")[0]) == null || l.remove(), (r = C.value) == null || r.unobserve(document.body), (a = K.value) == null || a.unobserve(S.value));
    }), B(() => w.value, () => {
      w.value && w.value.addEventListener("scroll", () => {
        m();
      });
    }, {
      deep: !0,
      immediate: !0
    }), () => {
      var l, r;
      return h(V, null, [h("div", {
        class: `step-tip-main ${g.value ? "top-index" : ""}`,
        ref: g.value ? S : P
      }, [(l = t.default) == null ? void 0 : l.call(t)]), g.value && h("div", {
        class: `step-tip-tip step-tip-${u.value}`,
        style: p.value,
        ref: A
      }, [((r = t.tip) == null ? void 0 : r.call(t)) || h("div", null, [f.value]), h("div", {
        class: "step-bottom-btn"
      }, [h(J, {
        size: "small",
        class: "jump-btn",
        type: "primary",
        onClick: D
      }, {
        default: () => [G("跳过全部")]
      }), h(J, {
        size: "small",
        class: "next-btn",
        type: "primary",
        onClick: _
      }, {
        default: () => [G("下一步")]
      })])]), g.value && h("div", {
        class: "global-mask"
      }, null)]);
    };
  }
});
export {
  we as CustomTree,
  Se as StepTips
};
