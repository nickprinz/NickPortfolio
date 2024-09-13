import { Action, PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { HSVtoRGB, HSVtoRGBHex, RBGtoHex, RGBtoHSV } from './colorHelpers';
import { PaletteValue } from '../interfaces/paletteValue';
import { Color } from '../interfaces/color';
import { Hsv } from '../interfaces/hsv';
import { createGridFromState } from './createGridFromState';


export interface ColorGrid{
    colors: string[][],
}
export interface PaletteState{
    seed: Color,
    rowCount: number,
    shadeCount: number,
    hueShift: number,
}

const makeDefaultState = (): PaletteState => {
    return {seed:HSVtoRGB({h:0,s:60,v:55}), rowCount:4, shadeCount:5, hueShift:20};
}



const paletteSlice = createSlice({
    name:"palette",
    initialState: makeDefaultState(),
    reducers:{
        reset(state: PaletteState, action){
            state = makeDefaultState();
        },
        setRowCount(state: PaletteState, action: PayloadAction<number>){
            state.rowCount = action.payload;//add safety checks
        },
        setColumnCount(state: PaletteState, action: PayloadAction<number>){
            state.shadeCount = action.payload;//add safety checks
        },
        setSeedColor(state: PaletteState, action: PayloadAction<Color>){
            state.seed = action.payload;//add safety checks
        },
    },
    selectors:{
        getColorGrid: createSelector(
            [((state) => state)],
            (state) => {
            return createGridFromState(state);
        }),
        getRowCount: (state) => {
            return state.rowCount;
        },
        getColumnCount: (state) => {
            return state.shadeCount;
        },
        getSeedColor: (state) => {
            return state.seed;
        },
        getSeedColorHex: (state) => {
            return RBGtoHex(state.seed) ;
        },
    }
});



export default paletteSlice.reducer;
export const paletteActions = paletteSlice.actions;
export const paletteSelectors = paletteSlice.selectors;
