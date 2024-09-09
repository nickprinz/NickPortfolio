import { createSelector, createSlice } from '@reduxjs/toolkit';
import { HSVtoRGBHex } from './colorHelpers';


export interface ColorGrid{
    colors: string[][],
}

const makeDefaultState = (): ColorGrid => {
    return {colors: makeNewGrid(0,4,5,100,30,40,90)}
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
