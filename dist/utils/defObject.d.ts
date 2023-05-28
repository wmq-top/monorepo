import type { DefObjectType, ExcludeObj } from './type';
declare class DefObject {
    static getKeysOfObject<T extends object>(obj: T): [keyof T];
    static deleteKey<T extends object, K extends keyof T>(obj: DefObjectType<T>, key: K): ExcludeObj<T, K>;
    static getDeleteKeyRes<T extends object, K extends keyof T>(obj: DefObjectType<T>, key: K, effect?: boolean): ExcludeObj<T, K>;
}
export { DefObject, DefObject as default };
