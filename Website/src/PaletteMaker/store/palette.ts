import { createSelector, createSlice } from '@reduxjs/toolkit';
import { HSVtoRGBHex, RGBtoHSV } from './colorHelpers';
import { PaletteValue } from '../interfaces/paletteValue';
import { Color } from '../interfaces/color';
import { Hsv } from '../interfaces/hsv';


export interface ColorGrid{
    colors: string[][],
}
export interface PaletteState{
    seed: Color,
    rowCount: number,
    shadeCount: number,
    hueShift: number,
}

const makeDefaultState = (): ColorGrid => {
    return {colors: makeNewGrid(0,4,5,100,30,40,90)}
}

const makeGridFromState = (state: PaletteState): string[][] => {
    const rowHueChange = 360/state.rowCount;
    const grid: string[][] = [];
    const seed: Hsv = RGBtoHSV(state.seed);

    for (let i = 0; i < state.rowCount; i++) {
        const hue = (seed.h + rowHueChange*i)%360;
        const rowCenter: Hsv = {h: hue, s:seed.s, v:seed.v};
        grid.push(makeNewRowFromCenter(rowCenter, state.shadeCount, 30, 30, 60, 80, state.hueShift));//need to split row across seed
    }

    return grid;

}

const makeNewGrid = (startHue: number, rows: number, columns: number, lowSat: number, lowValue: number, highSat: number, highValue: number): string[][] => {
    
    const rowHueChange = 360/rows;

    const grid: string[][] = [];
    for (let i = 0; i < rows; i++) {
        const hue = (startHue + rowHueChange*i)%360;
        grid.push(makeNewRow(hue, columns, lowSat, lowValue, highSat, highValue));
    }

    return grid;
}

const makeNewRow = (startHue: number, columns: number, lowSat: number, lowValue: number, highSat: number, highValue: number): string[] => {
    let row: string[] = [];
    const perColumn = 1/Math.max(columns-1,1);
    for (let i = 0; i < columns; i++) {
        const sat = lerp(lowSat, highSat, perColumn*i);
        const val = lerp(lowValue, highValue, perColumn*i);
        row.push(HSVtoRGBHex({h: startHue,s: sat,v: val}));
    }
    return row;
}

const makeNewRowFromCenter = (centerColor: Hsv, columns: number, lowSat: number, lowValue: number, highSat: number, highValue: number, hueShift: number): string[] => {
    let row: string[] = [];
    const middleIndex = Math.ceil(columns/2);
    const lowHue = middleIndex * -hueShift + centerColor.h;
    const lowHsv: Hsv = {h: lowHue, s: lowSat, v: lowValue};
    const highHue = (columns - middleIndex - 1) * hueShift + centerColor.h;
    const highHsv: Hsv = {h: highHue, s: highSat, v: highValue};
    //need 2 sepate loops lerping from low to middle, then middle to high
    let hsvs = fillColors(lowHsv, centerColor, middleIndex);
    hsvs.pop();//remove centerColor
    hsvs = hsvs.concat(fillColors(centerColor, highHsv, (columns - middleIndex - 1)));
    //convert hsvs

    return row;
}

const fillColors = (lowColor: Hsv, highColor: Hsv, colorCount: number): Hsv[] => {
    const colors: Hsv[] = [];
    //0  1  2
    //0 .5  1
    for (let i = 0; i < colorCount; i++) {
        const t = (colorCount-1)*(i);
        const hue = lerp(lowColor.h, highColor.h, t);
        const sat = lerp(lowColor.s, highColor.s, t);
        const val = lerp(lowColor.v, highColor.v, t);
        colors.push({h: hue,s: sat,v: val});
    }

    return colors;
}

const lerp = ( a: number, b: number, t: number ): number => {
    return a + t * ( b - a );
}

const paletteSlice = createSlice({
    name:"palette",
    initialState: makeDefaultState(),
    reducers:{
        clear(state: ColorGrid, action){
            return {colors: []};
        },
    },
    selectors:{
        selectStuff(state){
            return state.colors;
        },
        
    }
});



export default paletteSlice.reducer;
export const paletteActions = paletteSlice.actions;
export const paletteSelectors = paletteSlice.selectors;
