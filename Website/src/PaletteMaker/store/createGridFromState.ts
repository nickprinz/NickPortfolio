import { ColorCell } from "../interfaces/colorCell";
import { Hsv } from "../interfaces/hsv";
import { HSVtoRGBHex, LumFromHsv, RGBtoHSV } from "./colorHelpers";
import { PaletteState } from "./palette";

export const createGridFromState = (state: PaletteState): ColorCell[][] => {
    const rowHueChange = 360/state.rowCount;
    const grid: ColorCell[][] = [];
    const seed: Hsv = RGBtoHSV(state.seed);

    for (let i = 0; i < state.rowCount; i++) {
        const hue = (seed.h + rowHueChange*i)%360;
        const rowCenter: Hsv = {h: hue, s:seed.s, v:seed.v};
        grid.push(makeNewRowFromCenter(rowCenter, i, state.shadeCount, state.lowSat, state.lowValue, state.highSat, state.highValue, state.hueShift, state.cellAdjustments[i]));//need to split row across seed
    }

    return grid;

}

const makeNewRowFromCenter = (centerColor: Hsv, rowNum: number, columns: number, lowSat: number, lowValue: number, highSat: number, highValue: number, hueShift: number, cellAdjustments: Hsv[]): ColorCell[] => {
    
    const middleIndex = Math.ceil(columns/2);
    const lowHue = (middleIndex-1) * -hueShift + centerColor.h;
    const lowHsv: Hsv = {h: lowHue, s: lowSat, v: lowValue};
    const highHue = (columns - middleIndex) * hueShift + centerColor.h;
    const highHsv: Hsv = {h: highHue, s: highSat, v: highValue};
    
    let hsvs = fillColors(lowHsv, centerColor, middleIndex);
    hsvs.pop();//remove centerColor, second half will also have it
    hsvs = hsvs.concat(fillColors(centerColor, highHsv, (columns - middleIndex + 1)));
    hsvs = hsvs.map((x,i) => {
        return addHsv(x,cellAdjustments[i])
    });
    const row = hsvs.map((x, i) => {return {
        hexColor: HSVtoRGBHex(x),
        lum: LumFromHsv(x),
        id: `id#${rowNum}#${i}`,
        rowNum: rowNum,
        colNum: i,
        hue: x.h,
    }});

    return row;
}

const fillColors = (lowColor: Hsv, highColor: Hsv, colorCount: number): Hsv[] => {
    if(colorCount === 1) return [lowColor];

    const colors: Hsv[] = [];
    
    for (let i = 0; i < colorCount; i++) {
        const t = i/(colorCount-1);
        let hue = wrap(lerp(lowColor.h, highColor.h, t),360);
        const sat = lerp(lowColor.s, highColor.s, t);
        const val = lerp(lowColor.v, highColor.v, t);
        colors.push({h: hue,s: sat,v: val});
    }

    return colors;
}

const wrap = ( num: number, max: number): number => {
    let result = num;
    while(result > max){
        result = result - max;
    }
    while(result < 0){
        result = result + max;
    }
    
    return result
}

const lerp = ( a: number, b: number, t: number ): number => {
    return a + t * ( b - a );
}

const addHsv = (a:Hsv, b:Hsv): Hsv => {
    const result = {h: a.h+b.h, s:a.s+b.s, v:a.v+b.v}
    result.h = wrap(result.h,360);
    result.s = Math.min(Math.max(result.s,0), 100);
    result.v = Math.min(Math.max(result.v,0), 100);
    return result;
}