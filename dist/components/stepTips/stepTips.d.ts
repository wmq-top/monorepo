declare const StepTips: import("vue").DefineComponent<{
    text: {
        type: import("vue").PropType<string>;
        default: string;
    };
    position: {
        type: import("vue").PropType<import("./stepTips-type").StepTipsPosType>;
        default: string;
    };
    stepKey: {
        type: import("vue").PropType<string>;
        default: string;
    };
    activeKey: {
        type: import("vue").PropType<string>;
        default: string;
    };
    tipBoxStyle: {
        type: import("vue").PropType<Record<"minWidth" | "maxWidth" | "border", string>>;
        default: {
            minWidth: string;
            maxWidth: string;
            border: string;
        };
    };
    withMask: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    scrollRef: {
        type: import("vue").PropType<import("vue").Ref<Element>>;
        default: null;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    next: (_data: string) => boolean;
    jump: () => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    text: {
        type: import("vue").PropType<string>;
        default: string;
    };
    position: {
        type: import("vue").PropType<import("./stepTips-type").StepTipsPosType>;
        default: string;
    };
    stepKey: {
        type: import("vue").PropType<string>;
        default: string;
    };
    activeKey: {
        type: import("vue").PropType<string>;
        default: string;
    };
    tipBoxStyle: {
        type: import("vue").PropType<Record<"minWidth" | "maxWidth" | "border", string>>;
        default: {
            minWidth: string;
            maxWidth: string;
            border: string;
        };
    };
    withMask: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    scrollRef: {
        type: import("vue").PropType<import("vue").Ref<Element>>;
        default: null;
    };
}>> & {
    onNext?: ((_data: string) => any) | undefined;
    onJump?: (() => any) | undefined;
}, {
    text: string;
    activeKey: string;
    position: import("./stepTips-type").StepTipsPosType;
    stepKey: string;
    tipBoxStyle: Record<"minWidth" | "maxWidth" | "border", string>;
    withMask: boolean;
    scrollRef: import("vue").Ref<Element>;
}, {}>;
export { StepTips };
