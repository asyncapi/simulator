import React, { useMemo } from 'react';
import { ComponentWithDefaults as withDefaults } from '../UtilityModules/Wrappers/GetComponentItsDefaults';
import { useProportions } from '../UtilityModules/Statistics/calculations';
import { GeistUIThemesPalette } from '../styles/themes';
import useTheme from '../styles/use-theme';
import { NormalTypes } from '../UtilityModules/Types/Properties_Types';
//
interface Props {
    value?: number;
    limit?: number;
    color?: string;
    className?: string;
}

const defaultProps = {
    value: 0,
    limit: 100,
    color: '',
    className: '',
};

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type CapacityProps = Props & typeof defaultProps & NativeAttrs;

const getColor = (val: number, palette: GeistUIThemesPalette): string => {
    if (val < 33) return palette.cyan;
    if (val < 66) return palette.warning;
    return palette.errorDark;
};

// eslint-disable-next-line react/prop-types
const Capacity: React.FC<CapacityProps> = ({ value, limit, color: userColor, className, ...props }) => {
    const theme = useTheme();
    const percentValue = useProportions(value, limit);
    const color = useMemo(() => {
        if (userColor && userColor !== '') return userColor;
        return getColor(percentValue, theme.palette);
    }, [userColor, percentValue, theme.palette]);

    return (
        <div className={`capacity ${className}`} title={`${percentValue}%`} style={{
            width: "50px",
            height: "10px",
            borderRadius: `${theme.layout.radius}`,
            overflow: "hidden",
            backgroundColor: `${theme.palette.accents_2}`,
        }} {...props}>
            <span style={{
                width: `${percentValue}%`,
                backgroundColor: `${color}`,
                height: `100%`,
                margin: 0,
                padding: 0,
                display: 'block',
            }}/>
        </div>
    );
};

const MemoCapacity = React.memo(Capacity);

export default withDefaults(MemoCapacity, defaultProps);
