import * as React from 'react';
import { tuple } from './prop-types';

const StringUnionTypeCreator = <T extends string[]>(...args: T) => args;

export const TextStyles = StringUnionTypeCreator('normal', 'easily-readable', 'title1', 'title2', 'formal');

const normalTypes = tuple('default', 'secondary', 'success', 'warning', 'error');

export const PresetAttribtes = StringUnionTypeCreator(
    'PresetHeading1',
    'PresetHeading2',
    'PresetHeading3',
    'PresetParagraph1',
);

export const InlineAttributes = StringUnionTypeCreator('normal', 'border', 'sketch', 'ribbon', 'arrow', 'none');

export const HightlightStyles = StringUnionTypeCreator('none', 'ribbon', 'arrow', 'border', 'sketch', 'marker');
//Added to TextPractical Element To style text based on our library's templates.

export type TextPresetStyles = typeof PresetAttribtes[number];

export type TextTypographyPresets = typeof TextStyles[number];

export type HighlightStyles = typeof HightlightStyles[number];

export type InlineAttributesE = typeof InlineAttributes[number];

export type NormalTypes = typeof normalTypes[number];
