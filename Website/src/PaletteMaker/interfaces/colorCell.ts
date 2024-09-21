import { Hsv } from "./hsv";

export interface ColorCell{
    hexColor: string,
    lum: number,
    id: string,
    rowNum: number,
    colNum: number,
    hue: number,
    sat: number,
    val: number,
    chr: number,
    adjustments: Hsv,
}
