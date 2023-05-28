type ExcludeObj<T extends object, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
};
type DefObjectType<T> = T extends Array<any> ? never : T;
type FieldParams = 'name' | 'children' | 'id';
type FieldNamesType = Record<FieldParams, string>;
type TreeNodeType<T extends FieldNamesType, P extends FieldParams> = {
    [K in T[P]]: P extends 'name' | 'id' ? string : any[];
} & {
    level: string;
    onlyKey: string;
    dataDetail: Record<string, any>;
    prevArr: boolean[];
    parentId: string;
    parentNode?: TreeNodeType<T, P>;
};
export type { ExcludeObj, DefObjectType, FieldParams, FieldNamesType, TreeNodeType };
