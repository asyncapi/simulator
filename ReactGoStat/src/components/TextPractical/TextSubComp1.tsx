import React, { ReactElement, ReactNode, Children, useMemo } from 'react';
import { TextTypographyPresets, HighlightStyles, TextPresetStyles } from '../UtilityModules/Types/Properties_Types';
import { ComponentWithDefaults } from '../UtilityModules';
import '../styles/TextStyles.scss';

export interface SubComp1Props {
    preset?: TextPresetStyles;
    typographyPreset?: TextTypographyPresets;
    highlight?: HighlightStyles;
    sizeFont?: string | number;
    className?: string;
    marker?: boolean;
}

const TextSubComp1DefaultProps = {
    size: 15,
    className: `Default`,
};

type BasicHtmlAttributes = Omit<React.DetailsHTMLAttributes<any>, keyof SubComp1Props>;

export type SubComp1PropsHtmlAttributes = SubComp1Props & typeof TextSubComp1DefaultProps & BasicHtmlAttributes;

class TextSubComponent extends React.Component<React.PropsWithChildren<SubComp1PropsHtmlAttributes>> {
    render() {
        const { children, preset, size, className, typographyPreset, highlight, ...props } = this.props;

        let generatedClassAttribute = '';

        if (preset) generatedClassAttribute += 'preset-' + preset;

        if (typographyPreset) generatedClassAttribute += ' ' + 'typo-' + typographyPreset;

        if (highlight) generatedClassAttribute += ' ' + highlight;

        return (
            <>
                <div data-Type={'TextComp'} className={generatedClassAttribute}>
                    {children}
                </div>
            </>
        );
    }
}

const TextSubComponent1Memoized = React.memo(TextSubComponent);

export default ComponentWithDefaults(TextSubComponent1Memoized, TextSubComp1DefaultProps);
