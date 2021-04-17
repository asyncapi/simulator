import React from 'react';
import {ComponentWithDefaults} from '../UtilityModules';

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
