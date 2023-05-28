var d = Object.defineProperty;
var p = (u, n, e) => n in u ? d(u, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : u[n] = e;
var o = (u, n, e) => (p(u, typeof n != "symbol" ? n + "" : n, e), e);
import { DefObject as y } from "./defObject.mjs";
class a {
  static buildTree(n, e = this.defaultParams, t = this.defaultRootInfo) {
    return !n || n.length === 0 ? [] : n.map((r, l) => {
      var h;
      const s = [...t.prevArr];
      l === n.length - 1 ? s.push(!1) : s.push(!0);
      const c = {
        title: r[e.name],
        id: r[e.id],
        level: t.level,
        onlyKey: `${t.onlyKey}-${l}`,
        key: `${t.onlyKey}-${l}`,
        parentId: t.parentId,
        parentNode: t.parentNode,
        // isLeaf: false || !item[fieldParams.children] || item[fieldParams.children]?.length === 0,
        isLeaf: !1,
        isRealLeaf: !r[e.children] || ((h = r[e.children]) == null ? void 0 : h.length) === 0,
        prevArr: [...t.prevArr, !0],
        dataDetail: y.getDeleteKeyRes(r, e.children)
      }, i = {
        level: t.level + 1,
        onlyKey: `${t.onlyKey}-${l}`,
        prevArr: s,
        parentId: r[e.id],
        parentNode: { ...c }
      };
      return {
        ...c,
        children: this.buildTree(r[e.children], e, i)
      };
    });
  }
  static getNodePath(n, e = "title") {
    const t = [];
    let r = { ...n };
    for (; r; )
      t.push(r[e]), r = r.parentNode;
    return t.reverse();
  }
  static getNodeData(n, e, t = "onlyKey") {
    var l;
    const r = n.filter((s) => e.startsWith(s[t]));
    return r[0] ? ((l = r[0]) == null ? void 0 : l.onlyKey) === e ? r[0] : this.getNodeData(r[0].children, e) : null;
  }
  static getTreeConstruct(n, e) {
    const { fieldKey: t, connectKey: r, rootKeyValue: l } = { ...this.defaultConstructOptions, ...e }, s = [], c = /* @__PURE__ */ new Map();
    return n.forEach((h) => {
      h[r] === l ? s.push({ ...h }) : c.set(h[t], h);
    }), s.map((h) => ({
      ...h,
      children: this.getChildren(c, h[t], t, r)
    }));
  }
  static getChildren(n, e, t, r) {
    const l = [];
    return Array.from(n.values()).forEach((c) => {
      c[r] === e && l.push(c);
    }), l.length === 0 ? [] : (l.forEach((c) => {
      n.delete(c[t]);
    }), l.map((c) => ({
      ...c,
      children: this.getChildren(n, c[t], t, r)
    })));
  }
  static getAllNodeKeys(n, e = "onlyKey") {
    const t = { keys: [], nodes: /* @__PURE__ */ new Map() }, r = (l) => {
      !l || l.length === 0 || l.forEach((s) => {
        t.keys.push(s[e]), t.nodes.set(s[e], s), r(s.children);
      });
    };
    return r(n), t;
  }
}
o(a, "defaultParams", {
  name: "name",
  children: "children",
  id: "id"
}), o(a, "defaultRootInfo", {
  level: 0,
  onlyKey: "0",
  parentId: "root",
  parentNode: null,
  prevArr: []
}), o(a, "defaultConstructOptions", {
  fieldKey: "id",
  connectKey: "parentId",
  rootKeyValue: "root"
});
export {
  a as TreeConstructor
};
