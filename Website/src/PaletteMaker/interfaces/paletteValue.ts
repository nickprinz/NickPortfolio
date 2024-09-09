import { Color } from "./color";

export interface PaletteValue extends Color{
    hueAdjust: number,
    satAdjust: number,
    valAdjust: number,
}