import type { PropType } from 'vue';
import type { CheckNodeType, ExpandNodeType, FieldParams, Key, SearchParams, SelectNodeType } from './customTree-type';
declare const defaultSearchOption: SearchParams;
declare const defaultProps: {
    scrollHeight: {
        type: PropType<string>;
        default: string;
    };
    treeData: {
        type: PropType<unknown[]>;
        default: never[];
    };
    fieldParams: {
        type: PropType<Record<FieldParams, string>>;
        default: {
            name: string;
            id: string;
            children: string;
        };
    };
    isFlatData: {
        type: PropType<boolean>;
        default: boolean;
    };
    checkable: {
        type: PropType<boolean>;
        default: boolean;
    };
    checkedKeys: {
        type: PropType<Key[]>;
        default: never[];
    };
    checkStrictly: {
        type: PropType<boolean>;
        default: boolean;
    };
    expandKeys: {
        type: PropType<Key[]>;
        default: never[];
    };
    withSearch: {
        type: PropType<boolean>;
        default: boolean;
    };
    searchOptions: {
        type: PropType<SearchParams>;
        default: SearchParams;
    };
};
declare const emitsDefined: {
    change: () => boolean;
    expand: (_node: Record<string, any>, _isExpand: boolean, _data: {
        keys: ExpandNodeType['keys'];
        nodes: any[];
    }) => boolean;
    check: (_node: Record<string, any>, _isChecked: boolean, _data: CheckNodeType) => boolean;
    select: (_node: Record<string, any>, _isSelect: boolean, _data: SelectNodeType) => boolean;
};
export { defaultProps, defaultSearchOption, emitsDefined };
