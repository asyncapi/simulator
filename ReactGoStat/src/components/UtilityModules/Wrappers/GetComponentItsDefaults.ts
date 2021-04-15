import React from 'react';

export const ComponentWithDefaults = <PassedComponentType, Default_v_type>(
    Component: React.FunctionComponent<PassedComponentType>,
    default_values: Default_v_type,
) => {
    type CPropsFinalized = Partial<Default_v_type> & Omit<PassedComponentType, keyof Default_v_type>;
    Component.defaultProps = default_values;
    return Component as React.FunctionComponent<CPropsFinalized>;
};
