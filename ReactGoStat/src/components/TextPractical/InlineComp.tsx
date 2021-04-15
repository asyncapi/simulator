import React, { memo, ReactElement, ReactNode, useMemo } from 'react';
import { ComponentWithDefaults } from '../UtilityModules';
import { TextCompProps } from './TextComp';
import { InlineAttributesE } from '../UtilityModules/Types/Properties_Types';
import { filterPropsWithGroup } from '@geist-ui/react/dist/button/utils';

//
interface CompProps {
    normal?: boolean;
    border?: boolean;
    sketch?: boolean;
    ribbon?: boolean;
    arrow?: boolean;
}
const defaults: CompProps = {
    normal: false,
};

type BasicHtmlAttributes = Omit<React.HTMLAttributes<any>, keyof CompProps>;

type CompAttributes = CompProps & typeof defaults & BasicHtmlAttributes;
type InlineAttrArray = Array<boolean>;

/**
 * test
 * @param props
 * @returns {JSX.Element}
 */
function marker(props: React.PropsWithChildren<CompAttributes>) {
    const { normal, border, sketch, ribbon, arrow, children } = props;

    const PassedProps: CompProps = {
        normal: normal,
        border: border,
        sketch: sketch,
        ribbon: ribbon,
        arrow: arrow,
    };

    let tag;

    console.log(PassedProps);
    for (const [key, value] of Object.entries(PassedProps)) {
        if (value && !tag && tag != 'normal') tag = String(key);
    }
    return (
        <>
            <span data-tag={tag}>{children} </span>
        </>
    );
}
const memoizedComp = React.memo(marker);

export default ComponentWithDefaults(memoizedComp, defaults);
