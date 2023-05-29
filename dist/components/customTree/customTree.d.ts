import type { CheckNodeType, Key, SelectNodeType } from './customTree-type';
declare const CustomTree: import("vue").DefineComponent<{
    scrollHeight: {
        type: import("vue").PropType<string>;
        default: string;
    };
    treeData: {
        type: import("vue").PropType<unknown[]>;
        default: never[];
    };
    fieldParams: {
        type: import("vue").PropType<Record<import("./customTree-type").FieldParams, string>>;
        default: {
            name: string;
            id: string;
            children: string;
        };
    };
    isFlatData: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    checkable: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    checkedKeys: {
        type: import("vue").PropType<Key[]>;
        default: never[];
    };
    checkStrictly: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    expandKeys: {
        type: import("vue").PropType<Key[]>;
        default: never[];
    };
    withSearch: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    searchOptions: {
        type: import("vue").PropType<import("./customTree-type").SearchParams>;
        default: import("./customTree-type").SearchParams;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: () => boolean;
    expand: (_node: Record<string, any>, _isExpand: boolean, _data: {
        keys: Key[];
        nodes: any[];
    }) => boolean;
    check: (_node: Record<string, any>, _isChecked: boolean, _data: CheckNodeType) => boolean;
    select: (_node: Record<string, any>, _isSelect: boolean, _data: SelectNodeType) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    scrollHeight: {
        type: import("vue").PropType<string>;
        default: string;
    };
    treeData: {
        type: import("vue").PropType<unknown[]>;
        default: never[];
    };
    fieldParams: {
        type: import("vue").PropType<Record<import("./customTree-type").FieldParams, string>>;
        default: {
            name: string;
            id: string;
            children: string;
        };
    };
    isFlatData: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    checkable: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    checkedKeys: {
        type: import("vue").PropType<Key[]>;
        default: never[];
    };
    checkStrictly: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    expandKeys: {
        type: import("vue").PropType<Key[]>;
        default: never[];
    };
    withSearch: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    searchOptions: {
        type: import("vue").PropType<import("./customTree-type").SearchParams>;
        default: import("./customTree-type").SearchParams;
    };
}>> & {
    onChange?: (() => any) | undefined;
    onExpand?: ((_node: Record<string, any>, _isExpand: boolean, _data: {
        keys: Key[];
        nodes: any[];
    }) => any) | undefined;
    onCheck?: ((_node: Record<string, any>, _isChecked: boolean, _data: CheckNodeType) => any) | undefined;
    onSelect?: ((_node: Record<string, any>, _isSelect: boolean, _data: SelectNodeType) => any) | undefined;
}, {
    scrollHeight: string;
    treeData: unknown[];
    fieldParams: Record<import("./customTree-type").FieldParams, string>;
    isFlatData: boolean;
    checkable: boolean;
    checkedKeys: Key[];
    checkStrictly: boolean;
    expandKeys: Key[];
    withSearch: boolean;
    searchOptions: import("./customTree-type").SearchParams;
}, {}>;
export { CustomTree };
