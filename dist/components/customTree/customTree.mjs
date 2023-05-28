import { defineComponent as Z, ref as d, toRefs as ee, computed as N, watch as I, onMounted as se, createVNode as r, Fragment as V } from "vue";
import { Input as le, Tree as ae, message as A } from "ant-design-vue";
import { PlusSquareOutlined as te, MinusSquareOutlined as oe } from "@ant-design/icons-vue";
import "ant-design-vue/dist/antd.css";
import { TreeConstructor as u } from "../../utils/treeConstructor.mjs";
import { gethashcode as ne } from "../../utils/getHashcode.mjs";
import { defaultProps as ue, emitsDefined as re, defaultSearchOption as ce } from "./customTree-const.mjs";
import "./customTree-style.less.mjs";
const fe = /* @__PURE__ */ Z({
  name: "W3Login",
  props: ue,
  emits: re,
  setup(z, {
    emit: m,
    slots: v,
    expose: H
  }) {
    const K = d(`${ne()}`), {
      treeData: $,
      fieldParams: w,
      scrollHeight: T,
      checkable: b,
      checkedKeys: x,
      expandKeys: C,
      withSearch: q,
      searchOptions: W
    } = ee(z), S = d(), i = N(() => u.buildTree($.value, w.value)), p = N(() => Array.from(u.getAllNodeKeys(i.value).nodes.values())), h = d(), k = N(() => ({
      ...ce,
      ...W.value
    })), c = d([]), a = d({
      keys: [],
      nodes: /* @__PURE__ */ new Map()
    }), B = (e, {
      expanded: s,
      node: l
    }) => {
      a.value.keys = e, s ? a.value.nodes.set(l.id, l.dataRef) : a.value.nodes.delete(l.id), m("expand", l.dataRef, s, {
        keys: [...a.value.keys],
        nodes: [...a.value.nodes.values()]
      });
    }, O = async () => (c.value.length !== 0 ? (a.value.keys = u.getAllNodeKeys(c.value, "id").keys, a.value.nodes = u.getAllNodeKeys(c.value, "id").nodes) : c.value.length === 0 && (a.value.keys = u.getAllNodeKeys(i.value, "id").keys, a.value.nodes = u.getAllNodeKeys(i.value, "id").nodes), {
      keys: [...a.value.keys],
      nodes: [...a.value.nodes.values()]
    }), D = async () => (a.value.keys = [], a.value.nodes = /* @__PURE__ */ new Map(), {
      keys: [...a.value.keys],
      nodes: [...a.value.nodes.values()]
    }), F = (e = "keys") => e === "keys" ? [...a.value.keys] : [...a.value.nodes.values()], o = d({
      keys: [],
      nodes: []
    }), _ = (e, {
      checked: s,
      checkedNodes: l,
      node: t
    }) => {
      o.value.keys = e, o.value.nodes = l, m("check", t.dataRef, s, o.value);
    }, j = async () => b.value ? (c.value.length !== 0 ? (o.value.keys = u.getAllNodeKeys(c.value, "id").keys, o.value.nodes = Array.from(u.getAllNodeKeys(c.value, "id").nodes.values())) : c.value.length === 0 && (o.value.keys = u.getAllNodeKeys(i.value, "id").keys, o.value.nodes = Array.from(u.getAllNodeKeys(i.value, "id").nodes.values())), {
      keys: [...o.value.keys],
      nodes: [...o.value.nodes]
    }) : {
      keys: [],
      nodes: []
    }, E = async () => (o.value.keys = [], o.value.nodes = [], {
      keys: [...o.value.keys],
      nodes: [...o.value.nodes]
    }), G = async () => o.value, f = (e, s) => {
      if (s === "check" && (o.value.nodes = p.value.filter((l) => e.includes(l.id))), s === "expand") {
        const l = /* @__PURE__ */ new Map();
        p.value.forEach((t) => {
          e.includes(t.id) && l.set(t.id, t);
        }), a.value.nodes = l;
      }
    }, g = d(""), y = d({
      keys: [],
      nodes: []
    }), J = (e, {
      selected: s,
      selectedNodes: l,
      node: t
    }) => {
      y.value.keys = e, y.value.nodes = l, g.value = "", m("select", t, s, y.value);
    }, Q = (e, s, l) => {
      const t = p.value.find((n) => n.id === e);
      if (!t) {
        A.warning("当前定位的节点不存在~");
        return;
      }
      s ? a.value.keys = Array.from(/* @__PURE__ */ new Set([...u.getNodePath(t, "id"), ...a.value.keys])) : a.value.keys = u.getNodePath(t, "id"), f(a.value.keys, "expand"), y.value = {
        keys: [],
        nodes: []
      }, setTimeout(() => {
        var n;
        (n = S.value) == null || n.scrollTo({
          key: e,
          align: "top",
          offset: l || 30
        }), g.value = e;
      });
    };
    I(() => x.value, () => {
      o.value.keys = x.value, f(o.value.keys, "check");
    }, {
      deep: !0,
      immediate: !0
    }), I(() => C.value, () => {
      a.value.keys = C.value, f(a.value.keys, "expand");
    }, {
      deep: !0,
      immediate: !0
    });
    const L = d(500), R = () => new ResizeObserver((s) => {
      L.value = s[0].contentRect.height;
    }), U = () => {
      const e = document.getElementsByClassName("custom-tree-wrapper");
      let s = null;
      for (const l of Array.from(e))
        l.attributes["data-hash"].value === K.value && (s = l);
      R().observe(s);
    };
    se(() => {
      U();
    });
    const P = () => {
      D(), E();
      const e = p.value.filter((t) => {
        var n;
        return (n = k.value.targetList) == null ? void 0 : n.some((Y) => {
          var M;
          return (M = t[Y]) == null ? void 0 : M.includes(h.value);
        });
      });
      if (e.length === 0) {
        A.config({
          maxCount: 3
        }), A.warning({
          content: "没有匹配的节点~"
        });
        return;
      }
      const s = /* @__PURE__ */ new Set(), l = [];
      e.forEach((t) => {
        if (!t)
          return;
        let n = {
          ...t
        };
        for (; n; ) {
          if (s.has(n.onlyKey))
            return;
          s.add(n.onlyKey), l.push(n), n = n.parentNode;
        }
      }), c.value = u.buildTree(u.getTreeConstruct(l, {
        connectKey: "parentId",
        rootKeyValue: "root"
      }), w.value), O();
    }, X = (e) => {
      var s;
      h.value = (s = e.target) == null ? void 0 : s.value, h.value || (c.value = []), k.value.immediate && P();
    };
    return H({
      expandAllNode: O,
      closedAllNode: D,
      getAllExpandNodes: F,
      checkedAllNode: j,
      disCheckedAllNode: E,
      getAllCheckedNode: G,
      scrollTo: Q
    }), () => r("div", {
      class: "custom-tree-content"
    }, [q.value && r(le, {
      value: h.value,
      onChange: X,
      onPressEnter: P,
      placeholder: k.value.placeHolder
    }, null), r("div", {
      class: "custom-tree-wrapper",
      "data-hash": K.value
    }, [r(ae, {
      ref: S,
      class: "custom-tree",
      fieldNames: {
        key: "id"
      },
      treeData: c.value.length === 0 ? i.value : c.value,
      height: T.value === "auto" ? L.value : Number(T.value),
      checkable: b.value,
      checkedKeys: o.value.keys,
      onCheck: (e, {
        checked: s,
        checkedNodes: l,
        node: t
      }) => _(e, {
        checked: s,
        checkedNodes: l,
        node: t
      }),
      expandedKeys: a.value.keys,
      onExpand: (e, {
        expanded: s,
        node: l
      }) => B(e, {
        expanded: s,
        node: l
      }),
      selectedKeys: y.value.keys,
      onSelect: J
    }, {
      switcherIcon: ({
        dataRef: e,
        expanded: s
      }) => r(V, null, [[...new Array(e.level)].map((l, t) => r("span", {
        class: `self-indent ${e.prevArr[t + 1] ? "show-line" : ""}`
      }, null)), r("span", {
        class: `${e.level === "0" ? "root-icon" : "expand-icon"}`
      }, [!s && !e.isRealLeaf && r(te, {
        class: "custom-svg-icon",
        style: {
          color: "#878988"
        }
      }, null), s && !e.isRealLeaf && r(oe, {
        class: "custom-svg-icon",
        style: {
          color: "#878988"
        }
      }, null), e.isRealLeaf && r("span", {
        class: "last-self-indent"
      }, null)])]),
      title: ({
        dataRef: e
      }) => r(V, null, [r("span", {
        class: g.value === e.id ? "custom-title pre-focus" : "custom-title"
      }, [v.tag ? v.tag({
        dataRef: e
      }) : "", r("span", {
        class: "custom-title-item"
      }, [v.title ? v.title({
        dataRef: e
      }) : e.title]), v.operate ? v.operate({
        dataRef: e
      }) : ""])])
    })])]);
  }
});
export {
  fe as CustomTree
};
