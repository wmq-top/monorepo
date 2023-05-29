var te = Object.defineProperty;
var le = (i, e, t) => e in i ? te(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var O = (i, e, t) => (le(i, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as se, ref as m, toRefs as ae, computed as T, watch as B, onMounted as ne, createVNode as g, Fragment as H } from "vue";
import { Input as re, Tree as oe, message as E } from "ant-design-vue";
import { PlusSquareOutlined as ue, MinusSquareOutlined as ce } from "@ant-design/icons-vue";
import "ant-design-vue/dist/antd.css";
class de {
  static getKeysOfObject(e) {
    return Object.keys(e);
  }
  static deleteKey(e, t) {
    return Reflect.deleteProperty(e, t), e;
  }
  static getDeleteKeyRes(e, t, a) {
    if (a)
      return Reflect.deleteProperty(e, t), e;
    {
      const l = { ...e };
      return Reflect.deleteProperty(l, t), l;
    }
  }
}
class y {
  static buildTree(e, t = this.defaultParams, a = this.defaultRootInfo) {
    return !e || e.length === 0 ? [] : e.map((l, u) => {
      var f;
      const d = [...a.prevArr];
      u === e.length - 1 ? d.push(!1) : d.push(!0);
      const v = {
        title: l[t.name],
        id: l[t.id],
        level: a.level,
        onlyKey: `${a.onlyKey}-${u}`,
        key: `${a.onlyKey}-${u}`,
        parentId: a.parentId,
        parentNode: a.parentNode,
        // isLeaf: false || !item[fieldParams.children] || item[fieldParams.children]?.length === 0,
        isLeaf: !1,
        isRealLeaf: !l[t.children] || ((f = l[t.children]) == null ? void 0 : f.length) === 0,
        prevArr: [...a.prevArr, !0],
        dataDetail: de.getDeleteKeyRes(l, t.children)
      }, A = {
        level: a.level + 1,
        onlyKey: `${a.onlyKey}-${u}`,
        prevArr: d,
        parentId: l[t.id],
        parentNode: { ...v }
      };
      return {
        ...v,
        children: this.buildTree(l[t.children], t, A)
      };
    });
  }
  static getNodePath(e, t = "title") {
    const a = [];
    let l = { ...e };
    for (; l; )
      a.push(l[t]), l = l.parentNode;
    return a.reverse();
  }
  static getNodeData(e, t, a = "onlyKey") {
    var u;
    const l = e.filter((d) => t.startsWith(d[a]));
    return l[0] ? ((u = l[0]) == null ? void 0 : u.onlyKey) === t ? l[0] : this.getNodeData(l[0].children, t) : null;
  }
  static getTreeConstruct(e, t) {
    const { fieldKey: a, connectKey: l, rootKeyValue: u } = { ...this.defaultConstructOptions, ...t }, d = [], v = /* @__PURE__ */ new Map();
    return e.forEach((f) => {
      f[l] === u ? d.push({ ...f }) : v.set(f[a], f);
    }), d.map((f) => ({
      ...f,
      children: this.getChildren(v, f[a], a, l)
    }));
  }
  static getChildren(e, t, a, l) {
    const u = [];
    return Array.from(e.values()).forEach((v) => {
      v[l] === t && u.push(v);
    }), u.length === 0 ? [] : (u.forEach((v) => {
      e.delete(v[a]);
    }), u.map((v) => ({
      ...v,
      children: this.getChildren(e, v[a], a, l)
    })));
  }
  static getAllNodeKeys(e, t = "onlyKey") {
    const a = { keys: [], nodes: /* @__PURE__ */ new Map() }, l = (u) => {
      !u || u.length === 0 || u.forEach((d) => {
        a.keys.push(d[t]), a.nodes.set(d[t], d), l(d.children);
      });
    };
    return l(e), a;
  }
}
O(y, "defaultParams", {
  name: "name",
  children: "children",
  id: "id"
}), O(y, "defaultRootInfo", {
  level: 0,
  onlyKey: "0",
  parentId: "root",
  parentNode: null,
  prevArr: []
}), O(y, "defaultConstructOptions", {
  fieldKey: "id",
  connectKey: "parentId",
  rootKeyValue: "root"
});
function ie(i) {
  let e = 0;
  const t = i.length, a = 2147483648;
  for (let l = 0; l < t; l++)
    e = 31 * e + i.charCodeAt(l), e > 2147483647 && (e %= a);
  return e;
}
function ve(i, e, t) {
  let a = "", l = e;
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
  i && (l = Math.round(Math.random() * (t - e)) + e);
  for (let d = 0; d < l; d++) {
    const v = Math.round(Math.random() * (u.length - 1));
    a += u[v];
  }
  return a;
}
function he() {
  const i = (/* @__PURE__ */ new Date()).valueOf(), e = ve(!1, 6, 29);
  return ie(e + i.toString());
}
const I = {
  immediate: !1,
  mode: "locating",
  targetList: ["title"],
  placeHolder: "please input search"
}, ye = {
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
    default: I
  }
}, pe = {
  change: () => !0,
  expand: (i, e, t) => !0,
  check: (i, e, t) => !0,
  select: (i, e, t) => !0
};
const Ae = /* @__PURE__ */ se({
  name: "W3Login",
  props: ye,
  emits: pe,
  setup(i, {
    emit: e,
    slots: t,
    expose: a
  }) {
    const l = m(`${he()}`), {
      treeData: u,
      fieldParams: d,
      scrollHeight: v,
      checkable: A,
      checkedKeys: f,
      expandKeys: x,
      withSearch: W,
      searchOptions: F
    } = ae(i), M = m(), N = T(() => y.buildTree(u.value, d.value)), w = T(() => Array.from(y.getAllNodeKeys(N.value).nodes.values())), C = m(), S = T(() => ({
      ...I,
      ...F.value
    })), k = m([]), o = m({
      keys: [],
      nodes: /* @__PURE__ */ new Map()
    }), z = (s, {
      expanded: n,
      node: r
    }) => {
      o.value.keys = s, n ? o.value.nodes.set(r.id, r.dataRef) : o.value.nodes.delete(r.id), e("expand", r.dataRef, n, {
        keys: [...o.value.keys],
        nodes: [...o.value.nodes.values()]
      });
    }, L = async () => (k.value.length !== 0 ? (o.value.keys = y.getAllNodeKeys(k.value, "id").keys, o.value.nodes = y.getAllNodeKeys(k.value, "id").nodes) : k.value.length === 0 && (o.value.keys = y.getAllNodeKeys(N.value, "id").keys, o.value.nodes = y.getAllNodeKeys(N.value, "id").nodes), {
      keys: [...o.value.keys],
      nodes: [...o.value.nodes.values()]
    }), R = async () => (o.value.keys = [], o.value.nodes = /* @__PURE__ */ new Map(), {
      keys: [...o.value.keys],
      nodes: [...o.value.nodes.values()]
    }), j = (s = "keys") => s === "keys" ? [...o.value.keys] : [...o.value.nodes.values()], h = m({
      keys: [],
      nodes: []
    }), q = (s, {
      checked: n,
      checkedNodes: r,
      node: c
    }) => {
      h.value.keys = s, h.value.nodes = r, e("check", c.dataRef, n, h.value);
    }, G = async () => A.value ? (k.value.length !== 0 ? (h.value.keys = y.getAllNodeKeys(k.value, "id").keys, h.value.nodes = Array.from(y.getAllNodeKeys(k.value, "id").nodes.values())) : k.value.length === 0 && (h.value.keys = y.getAllNodeKeys(N.value, "id").keys, h.value.nodes = Array.from(y.getAllNodeKeys(N.value, "id").nodes.values())), {
      keys: [...h.value.keys],
      nodes: [...h.value.nodes]
    }) : {
      keys: [],
      nodes: []
    }, _ = async () => (h.value.keys = [], h.value.nodes = [], {
      keys: [...h.value.keys],
      nodes: [...h.value.nodes]
    }), J = async () => h.value, b = (s, n) => {
      if (n === "check" && (h.value.nodes = w.value.filter((r) => s.includes(r.id))), n === "expand") {
        const r = /* @__PURE__ */ new Map();
        w.value.forEach((c) => {
          s.includes(c.id) && r.set(c.id, c);
        }), o.value.nodes = r;
      }
    }, D = m(""), K = m({
      keys: [],
      nodes: []
    }), Q = (s, {
      selected: n,
      selectedNodes: r,
      node: c
    }) => {
      K.value.keys = s, K.value.nodes = r, D.value = "", e("select", c, n, K.value);
    }, U = (s, n, r) => {
      const c = w.value.find((p) => p.id === s);
      if (!c) {
        E.warning("当前定位的节点不存在~");
        return;
      }
      n ? o.value.keys = Array.from(/* @__PURE__ */ new Set([...y.getNodePath(c, "id"), ...o.value.keys])) : o.value.keys = y.getNodePath(c, "id"), b(o.value.keys, "expand"), K.value = {
        keys: [],
        nodes: []
      }, setTimeout(() => {
        var p;
        (p = M.value) == null || p.scrollTo({
          key: s,
          align: "top",
          offset: r || 30
        }), D.value = s;
      });
    };
    B(() => f.value, () => {
      h.value.keys = f.value, b(h.value.keys, "check");
    }, {
      deep: !0,
      immediate: !0
    }), B(() => x.value, () => {
      o.value.keys = x.value, b(o.value.keys, "expand");
    }, {
      deep: !0,
      immediate: !0
    });
    const P = m(500), X = () => new ResizeObserver((n) => {
      P.value = n[0].contentRect.height;
    }), Y = () => {
      const s = document.getElementsByClassName("custom-tree-wrapper");
      let n = null;
      for (const r of Array.from(s))
        r.attributes["data-hash"].value === l.value && (n = r);
      X().observe(n);
    };
    ne(() => {
      Y();
    });
    const $ = () => {
      R(), _();
      const s = w.value.filter((c) => {
        var p;
        return (p = S.value.targetList) == null ? void 0 : p.some((ee) => {
          var V;
          return (V = c[ee]) == null ? void 0 : V.includes(C.value);
        });
      });
      if (s.length === 0) {
        E.config({
          maxCount: 3
        }), E.warning({
          content: "没有匹配的节点~"
        });
        return;
      }
      const n = /* @__PURE__ */ new Set(), r = [];
      s.forEach((c) => {
        if (!c)
          return;
        let p = {
          ...c
        };
        for (; p; ) {
          if (n.has(p.onlyKey))
            return;
          n.add(p.onlyKey), r.push(p), p = p.parentNode;
        }
      }), k.value = y.buildTree(y.getTreeConstruct(r, {
        connectKey: "parentId",
        rootKeyValue: "root"
      }), d.value), L();
    }, Z = (s) => {
      var n;
      C.value = (n = s.target) == null ? void 0 : n.value, C.value || (k.value = []), S.value.immediate && $();
    };
    return a({
      expandAllNode: L,
      closedAllNode: R,
      getAllExpandNodes: j,
      checkedAllNode: G,
      disCheckedAllNode: _,
      getAllCheckedNode: J,
      scrollTo: U
    }), () => g("div", {
      class: "custom-tree-content"
    }, [W.value && g(re, {
      value: C.value,
      onChange: Z,
      onPressEnter: $,
      placeholder: S.value.placeHolder
    }, null), g("div", {
      class: "custom-tree-wrapper",
      "data-hash": l.value
    }, [g(oe, {
      ref: M,
      class: "custom-tree",
      fieldNames: {
        key: "id"
      },
      treeData: k.value.length === 0 ? N.value : k.value,
      height: v.value === "auto" ? P.value : Number(v.value),
      checkable: A.value,
      checkedKeys: h.value.keys,
      onCheck: (s, {
        checked: n,
        checkedNodes: r,
        node: c
      }) => q(s, {
        checked: n,
        checkedNodes: r,
        node: c
      }),
      expandedKeys: o.value.keys,
      onExpand: (s, {
        expanded: n,
        node: r
      }) => z(s, {
        expanded: n,
        node: r
      }),
      selectedKeys: K.value.keys,
      onSelect: Q
    }, {
      switcherIcon: ({
        dataRef: s,
        expanded: n
      }) => g(H, null, [[...new Array(s.level)].map((r, c) => g("span", {
        class: `self-indent ${s.prevArr[c + 1] ? "show-line" : ""}`
      }, null)), g("span", {
        class: `${s.level === "0" ? "root-icon" : "expand-icon"}`
      }, [!n && !s.isRealLeaf && g(ue, {
        class: "custom-svg-icon",
        style: {
          color: "#878988"
        }
      }, null), n && !s.isRealLeaf && g(ce, {
        class: "custom-svg-icon",
        style: {
          color: "#878988"
        }
      }, null), s.isRealLeaf && g("span", {
        class: "last-self-indent"
      }, null)])]),
      title: ({
        dataRef: s
      }) => g(H, null, [g("span", {
        class: D.value === s.id ? "custom-title pre-focus" : "custom-title"
      }, [t.tag ? t.tag({
        dataRef: s
      }) : "", g("span", {
        class: "custom-title-item"
      }, [t.title ? t.title({
        dataRef: s
      }) : s.title]), t.operate ? t.operate({
        dataRef: s
      }) : ""])])
    })])]);
  }
});
export {
  Ae as CustomTree
};
