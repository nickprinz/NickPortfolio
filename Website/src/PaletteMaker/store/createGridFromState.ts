import { ColorCell } from "../interfaces/colorCell";
import { Hsv } from "../interfaces/hsv";
import { ChromaFromHsv, HSVtoRGBHex, LumFromHsv, RGBtoHSV } from "./colorHelpers";
import { PaletteState } from "./palette";

export const createGridFromState = (state: PaletteState): ColorCell[][] => {
    const rowHueChange = 360/state.rowCount;
    const grid: ColorCell[][] = [];
    const seed: Hsv = RGBtoHSV(state.seed);

    for (let i = 0; i < state.rowCount; i++) {
        const hue = wrap(seed.h + rowHueChange*i, 360);
        const rowCenter: Hsv = {h: hue, s:seed.s, v:seed.v};
        grid.push(makeNewRowFromCenter(rowCenter, i, state.shadeCount, state.lowSat, state.lowValue, state.highSat, state.highValue, state.hueShift, state.cellAdjustments[i]));//need to split row across seed
    }

    return grid;
}

export const createCellFromState = (state: PaletteState, row: number, column: number): ColorCell => {
    const centerColor = getRowCenterColor(RGBtoHSV(state.seed), row, state.rowCount);
    const interpolatedColor: Hsv = getInterpolatedColor(centerColor, column, state);
    const resultColor = applyAdjustments(interpolatedColor, row, column, state);
    return makeCellFromColor(resultColor, row, column);
}

const getRowCenterColor = (seed: Hsv, row:number, rowCount: number):Hsv => {
    const rowHueChange = 360/rowCount;
    const centerHue =  wrap(seed.h + (rowHueChange*row), 360);
    return {h:centerHue, s: seed.s, v:seed.v};
}

const getEndColor = (centerColor: Hsv, endSat:number, endValue: number, hueShift: number, columnDiff:number):Hsv => {
    const newHue = centerColor.h + hueShift*(columnDiff-1);//don't wrap this, helps with lerp
    return {h:newHue, s: endSat, v:endValue};
}

const applyAdjustments = (startColor:Hsv, row: number, column: number, state: PaletteState): Hsv => {
    //need to apply column and row adjustments later
    return addHsv(startColor,state.cellAdjustments[row][column]);
}

const getInterpolatedColor = (centerColor: Hsv, column: number, state: PaletteState): Hsv => {
    const middleIndex = Math.ceil(state.shadeCount/2);
    let resultColor: Hsv;
    if(column < middleIndex){
        const lowColor = getEndColor(centerColor, state.lowSat, state.lowValue, state.hueShift, -middleIndex);
        resultColor = lerpColor(lowColor, centerColor, column/middleIndex);
    }
    else if(column > middleIndex){
        const highColor = getEndColor(centerColor, state.highSat, state.highValue, state.hueShift, state.shadeCount-1-middleIndex);
        resultColor = lerpColor(highColor, centerColor, column/middleIndex);

    } else{
        resultColor = centerColor;
    }
    resultColor.h = wrap(resultColor.h,360);
    return resultColor;
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
    const row = hsvs.map((x, i) => {return makeCellFromColor(x, rowNum, i)});

    return row;
}

const makeCellFromColor = (color: Hsv, row:number, column:number): ColorCell => {
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
    }
}

const fillColors = (lowColor: Hsv, highColor: Hsv, colorCount: number): Hsv[] => {
    if(colorCount === 1) return [lowColor];

    const colors: Hsv[] = [];
    
    for (let i = 0; i < colorCount; i++) {
        const t = i/(colorCount-1);
        colors.push(lerpColor(lowColor, highColor, t));
    }

    return colors;
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