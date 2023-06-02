import type { PropType, Ref } from 'vue';
import type { StepTipsPosType } from './stepTips-type';
declare const defaultProps: {
    text: {
        type: PropType<string>;
        default: string;
    };
    position: {
        type: PropType<StepTipsPosType>;
        default: string;
    };
    stepKey: {
        type: PropType<string>;
        default: string;
    };
    activeKey: {
        type: PropType<string>;
        default: string;
    };
    tipBoxStyle: {
        type: PropType<Record<"minWidth" | "maxWidth" | "border", string>>;
        default: {
            minWidth: string;
            maxWidth: string;
            border: string;
        };
    };
    withMask: {
        type: PropType<boolean>;
        default: boolean;
    };
    scrollRef: {
        type: PropType<Ref<Element>>;
        default: null;
    };
};
declare const defaultEmits: {
    next: (_data: string) => boolean;
    jump: () => boolean;
};
export { defaultProps, defaultEmits };
