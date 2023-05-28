import type { ExcludeObj, FieldNamesType } from './type';
type TreeNodeType = {
    isLeaf: boolean;
    dataDetail: Record<string, any>;
} & RequestParamsType & InjectParamsType;
interface InjectParamsType {
    level: number;
    onlyKey: string;
    parentId: string;
    prevArr: boolean[];
    parentNode?: ExcludeObj<TreeNodeType, 'children'> | null;
}
interface RequestParamsType {
    title: string;
    id: string;
    children: TreeNodeType[];
}
interface ConstructOptions {
    fieldKey?: string;
    connectKey?: string;
    rootKeyValue: string;
}
declare class TreeConstructor {
    static defaultParams: FieldNamesType;
    static defaultRootInfo: InjectParamsType;
    static defaultConstructOptions: NonNullable<ConstructOptions>;
    static buildTree(data: any[], fieldParams?: FieldNamesType, rootInfo?: InjectParamsType): TreeNodeType[];
    static getNodePath(node: TreeNodeType, desc?: 'title' | 'id' | 'onlyKey'): string[];
    static getNodeData(treeData: TreeNodeType[], onlyKey: string, desc?: 'onlyKey'): TreeNodeType | null;
    static getTreeConstruct<T extends Record<string, any>>(data: T[], options: ConstructOptions): (T & {
        children: any[];
    })[];
    static getChildren(map: Map<string, any>, targetKey: string, fieldKey: string, connectKey: string): any[];
    static getAllNodeKeys(treeData: any[], onlyKey?: string): {
        keys: string[];
        nodes: Map<string, any>;
    };
}
export { TreeConstructor };
