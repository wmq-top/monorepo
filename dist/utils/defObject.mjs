class c {
  static getKeysOfObject(e) {
    return Object.keys(e);
  }
  static deleteKey(e, t) {
    return Reflect.deleteProperty(e, t), e;
  }
  static getDeleteKeyRes(e, t, l) {
    if (l)
      return Reflect.deleteProperty(e, t), e;
    {
      const r = { ...e };
      return Reflect.deleteProperty(r, t), r;
    }
  }
}
export {
  c as DefObject,
  c as default
};
