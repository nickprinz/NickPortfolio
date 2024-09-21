import { ColorCell } from "../interfaces/colorCell";
import { Hsv } from "../interfaces/hsv";
import { ChromaFromHsv, HSVtoRGBHex, LumFromHsv, RGBtoHSV } from "./colorHelpers";
import { PaletteState } from "./palette";

export const createCellFromState = (state: PaletteState, row: number, column: number): ColorCell => {
    const centerColor = getRowCenterColor(RGBtoHSV(state.seed), row, state.rowCount);
    const interpolatedColor: Hsv = getInterpolatedColor(centerColor, column, state);
    const resultColor = applyAdjustments(interpolatedColor, row, column, state);
    return makeCellFromColor(resultColor, row, column, state.cellAdjustments[row][column]);
}

const getRowCenterColor = (seed: Hsv, row:number, rowCount: number):Hsv => {
    const rowHueChange = 360/rowCount;
    const centerHue =  wrap(seed.h + (rowHueChange*row), 360);
    return {h:centerHue, s: seed.s, v:seed.v};
}

const applyAdjustments = (startColor:Hsv, row: number, column: number, state: PaletteState): Hsv => {
    //need to apply column and row adjustments later
    return addHsv(startColor,state.cellAdjustments[row][column]);
}

const getInterpolatedColor = (centerColor: Hsv, column: number, state: PaletteState): Hsv => {
    const middleIndex = Math.floor(state.shadeCount/2);
    let resultColor: Hsv;
    if(column < middleIndex){
        const lowColor = getEndColor(centerColor, state.lowSat, state.lowValue, state.hueShift, -middleIndex);
        resultColor = lerpColor(lowColor, centerColor, column/middleIndex);
    }
    else if(column > middleIndex){
        const highColor = getEndColor(centerColor, state.highSat, state.highValue, state.hueShift, state.shadeCount-1-middleIndex);
        const t = (column - middleIndex) / (state.shadeCount-1-middleIndex);//0 is middleIndex, 1 is state.shadeCount-1
        resultColor = lerpColor(centerColor, highColor, t);

    } else{
        resultColor = centerColor;
    }
    resultColor.h = wrap(resultColor.h,360);
    return resultColor;
}

const getEndColor = (centerColor: Hsv, endSat:number, endValue: number, hueShift: number, columnDiff:number):Hsv => {
    const newHue = centerColor.h + hueShift*columnDiff;//don't wrap this, helps with lerp
    return {h:newHue, s: endSat, v:endValue};
}

const makeCellFromColor = (color: Hsv, row:number, column:number, adjustments: Hsv): ColorCell => {
    return {
        hexColor: HSVtoRGBHex(color),
        lum: LumFromHsv(color),
        id: `id#${row}#${column}`,
        rowNum: row,
        colNum: column,
        hue: color.h,
        sat: color.s,
        val: color.v,
        chr: ChromaFromHsv(color),
        adjustments: adjustments,
    }
}

const lerpColor = (lowColor: Hsv, highColor: Hsv, t: number) : Hsv => {
    let hue = wrap(lerp(lowColor.h, highColor.h, t),360);
    const sat = lerp(lowColor.s, highColor.s, t);
    const val = lerp(lowColor.v, highColor.v, t);
    return {h: hue,s: sat,v: val};

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