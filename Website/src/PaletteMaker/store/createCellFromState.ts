import { ColorCell } from "../interfaces/colorCell";
import { Hsv } from "../interfaces/hsv";
import { ChromaFromHsv, HSVtoRGBHex, LumFromHsv, RGBtoHSV } from "./colorHelpers";
import { fromNHue, toNHue } from "./hueShifter";
import { lerp, wrap } from "./mathHelpers";
import { PaletteState } from "./palette";
import { PrimaryColors } from "./primaryColors";

export const createCellFromState = (state: PaletteState, row: number, column: number): ColorCell => {
    //need to handle desat rows
    //first check if row is > state.rowcount
    //if so, get the cell from row - state.rowcount
    //then apply desat
    const seed: Hsv = RGBtoHSV(state.seed);
    if(state.primaryColors === PrimaryColors.RYB) seed.h = toNHue(seed.h);
    const centerColor = getRowCenterColor(seed, row, state.rowCount);
    const hueShift = state.hueShiftDirections[row] ? state.hueShift : -state.hueShift;
    const interpolatedColor: Hsv = getInterpolatedColor(centerColor, column, hueShift, state);
    if(state.primaryColors === PrimaryColors.RYB)  interpolatedColor.h = fromNHue(interpolatedColor.h);
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
    let adjustedHsv = addHsv(startColor,state.cellAdjustments[row][column]);
    adjustedHsv = addHsv(adjustedHsv,state.rowAdjustments[row]);
    adjustedHsv = addHsv(adjustedHsv,state.columnAdjustments[column]);
    return adjustedHsv;
}

const getInterpolatedColor = (centerColor: Hsv, column: number, hueShift: number ,state: PaletteState): Hsv => {
    const middleIndex = Math.floor(state.shadeCount/2);
    let resultColor: Hsv;
    if(column < middleIndex){
        const lowColor = getEndColor(centerColor, state.lowSat, state.lowValue, hueShift, -middleIndex);
        resultColor = lerpColor(lowColor, centerColor, column/middleIndex);
    }
    else if(column > middleIndex){
        const highColor = getEndColor(centerColor, state.highSat, state.highValue, hueShift, state.shadeCount-1-middleIndex);
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

const addHsv = (a:Hsv, b:Hsv): Hsv => {
    const result = {h: a.h+b.h, s:a.s+b.s, v:a.v+b.v}
    result.h = wrap(result.h,360);
    result.s = Math.min(Math.max(result.s,0), 100);
    result.v = Math.min(Math.max(result.v,0), 100);
    return result;
}