import type { DefObjectType, ExcludeObj } from './type'

class DefObject {
  static getKeysOfObject<T extends object>(obj: T): [keyof T] {
    return Object.keys(obj) as [keyof T]
  }

  static deleteKey<T extends object, K extends keyof T>(obj: DefObjectType<T>, key: K): ExcludeObj<T, K> {
    Reflect.deleteProperty(obj, key)

    return obj as ExcludeObj<T, K>
  }

  static getDeleteKeyRes<T extends object, K extends keyof T>(obj: DefObjectType<T>, key: K, effect?: boolean): ExcludeObj<T, K> {
    if (effect) {
      Reflect.deleteProperty(obj, key)

      return obj as ExcludeObj<T, K>
    }
    else {
      const result = { ...obj }

      Reflect.deleteProperty(result, key)

      return result as ExcludeObj<T, K>
    }
  }
}

export { DefObject, DefObject as default }
