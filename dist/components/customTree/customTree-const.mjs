const l = {
  immediate: !1,
  mode: "locating",
  targetList: ["title"],
  placeHolder: "please input search"
}, d = {
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
    default: l
  }
}, c = {
  change: () => !0,
  expand: (e, t, a) => !0,
  check: (e, t, a) => !0,
  select: (e, t, a) => !0
};
export {
  d as defaultProps,
  l as defaultSearchOption,
  c as emitsDefined
};
