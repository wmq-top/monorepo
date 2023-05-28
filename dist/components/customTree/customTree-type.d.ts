type FieldParams = 'name' | 'children' | 'id';
type Key = string | number;
interface ExpandNodeType {
    keys: Key[];
    nodes: Map<string, any>;
}
interface CheckNodeType {
    keys: Key[];
    nodes: Record<string, any>[];
}
interface SelectNodeType {
    keys: Key[];
    nodes: Record<string, any>[];
}
interface TagProps {
    key: string;
    tagMap: Record<string | number, string>;
}
interface SearchParams {
    immediate?: boolean;
    mode?: 'locating' | 'filter';
    targetList?: string[];
    placeHolder?: string;
}
interface CustomTreeRef {
    expandAllNode: () => Promise<{
        keys: Key[];
        nodes: any[];
    }>;
    closedAllNode: () => Promise<{
        keys: Key[];
        nodes: any[];
    }>;
    getAllExpandNodes: <T extends 'keys' | 'nodes'>(target: T) => T extends 'keys' ? string[] : any[];
    checkedAllNode: () => Promise<{
        keys: Key[];
        nodes: any[];
    }>;
    disCheckedAllNode: () => Promise<{
        keys: Key[];
        nodes: any[];
    }>;
    scrollTo: (key: Key, keepExpand: boolean, offset?: number) => null;
    getAllCheckedNode: () => Promise<{
        keys: Key[];
        nodes: any[];
    }>;
}
export type { FieldParams, Key, ExpandNodeType, CheckNodeType, CustomTreeRef, SelectNodeType, TagProps, SearchParams };
