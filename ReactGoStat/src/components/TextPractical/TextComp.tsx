import React, { ReactElement, ReactNode, useMemo } from 'react';
import { ComponentWithDefaults } from '../UtilityModules';
import '../styles/TextStyles.scss';
import { default as TextSubComponent1 } from './TextSubComp1';
import { TextTypographyPresets, HighlightStyles, TextPresetStyles } from '../UtilityModules/Types/Properties_Types';

interface ComponentProps {
    typographyPreset?: TextTypographyPresets;
    highlight?: HighlightStyles;
    preset?: TextPresetStyles;
    additionalClass?: string;
    size?: number | string;
    a?: boolean;
    marker?: boolean;
}
//
const DefaultProperties = {
    size: 15,
    a: false,
};

type ElementTypes = ComponentProps;

type BasicHtmlAttributes = Omit<React.HTMLAttributes<any>, keyof ComponentProps>;

export type TextCompProps = typeof DefaultProperties & ComponentProps & BasicHtmlAttributes;

type HtmlElementsList = { [key in keyof JSX.IntrinsicElements]?: boolean };

type AppendableInlineElements = Array<keyof JSX.IntrinsicElements>;
function GetComponentChildren(
    children: ReactNode | ReactElement,
    inlineComp: AppendableInlineElements,
    size?: string | number,
) {
    if (!inlineComp.length) return <TextSubComponent1>{children}</TextSubComponent1>;
    const NextChildComp = inlineComp.slice(1, inlineComp.length);
    const ThisComp = inlineComp[0];
    return <ThisComp>{GetComponentChildren(children, NextChildComp, size)}</ThisComp>;
}

export type PresetsArray = Array<TextPresetStyles>;

export type HighlightStylesArray = Array<HighlightStyles>;

export type TypographyPresets = Array<TextTypographyPresets>;

type PropsArray = Array<keyof ComponentProps>;
type InlinePropsArray = Array<keyof JSX.IntrinsicElements>;
function TextComp(props: React.PropsWithChildren<TextCompProps>) {
    const { size, a, preset, additionalClass, highlight, typographyPreset, children } = props;
    const AvailableAppendableElements: ElementTypes = {
        preset: preset,
        highlight: highlight,
        typographyPreset: typographyPreset,
        additionalClass: additionalClass,
        size,
    };
    const AvailableAppendableInlineElements: ElementTypes = {
        a,
    };

    const AppendblePresetsSanitized = Object.keys(AvailableAppendableElements).filter((element) => {
        const Index = element as keyof ElementTypes;
        return AvailableAppendableElements[Index];
    }) as PresetsArray;

    const AppendbleInlineElementsSanitized = Object.keys(AvailableAppendableInlineElements).filter(
        (element: string) => {
            const Index = element as keyof ElementTypes;
            return AvailableAppendableInlineElements[Index];
        },
    ) as InlinePropsArray;

    const CompName = useMemo(() => {
        if (AppendblePresetsSanitized[0]) return AppendbleInlineElementsSanitized[0];
        if (AppendbleInlineElementsSanitized[0]) return AppendbleInlineElementsSanitized[0];
        return 'p' as keyof JSX.IntrinsicElements;
    }, [AppendblePresetsSanitized, AppendbleInlineElementsSanitized]);

    const childrenElem = useMemo(() => {
        if (!AppendbleInlineElementsSanitized.length) return children;
        return GetComponentChildren(children, AppendbleInlineElementsSanitized, size);
    }, [AppendbleInlineElementsSanitized, children, size]);

    return (
        <TextSubComponent1 typographyPreset={typographyPreset} preset={preset} highlight={highlight}>
            {childrenElem}
        </TextSubComponent1>
    );
}

const MemoizedComponent = React.memo(TextComp);

export default ComponentWithDefaults(MemoizedComponent, DefaultProperties);
