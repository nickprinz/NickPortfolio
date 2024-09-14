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
    highSat: number,
    highValue: number,
    lowSat: number,
    lowValue: number,
}

const makeDefaultState = (): PaletteState => {
    return {
        seed:HSVtoRGB({h:0,s:60,v:55}), 
        rowCount:4, 
        shadeCount:5, 
        hueShift:20,
        highSat:30,
        highValue:80,
        lowSat:60,
        lowValue:30,
    };
}

const paletteSlice = createSlice({
    name:"palette",
    initialState: makeDefaultState(),
    reducers:{
        reset(state: PaletteState, action){
            const defaultState = makeDefaultState();
            //redux does not persist assigning a new state, so instead iterate through keys
            Object.keys(defaultState).forEach((key) => {
                state[key] = defaultState[key];
            });
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
        setHueShift(state: PaletteState, action: PayloadAction<number>){
            state.hueShift = action.payload;//add safety checks
        },
        setLowSat(state: PaletteState, action: PayloadAction<number>){
            state.lowSat = action.payload;//add safety checks
        },
        setLowVal(state: PaletteState, action: PayloadAction<number>){
            state.lowValue = action.payload;//add safety checks
        },
        setHighSat(state: PaletteState, action: PayloadAction<number>){
            state.highSat = action.payload;//add safety checks
        },
        setHighVal(state: PaletteState, action: PayloadAction<number>){
            state.highValue = action.payload;//add safety checks
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
        getHueShift: (state) => {
            return state.hueShift;
        },
        getLowSat: (state) => {
            return state.lowSat;
        },
        getLowVal: (state) => {
            return state.lowValue;
        },
        getHighSat: (state) => {
            return state.highSat;
        },
        getHighVal: (state) => {
            return state.highValue;
        },
    }
});

export default paletteSlice.reducer;
export const paletteActions = paletteSlice.actions;
export const paletteSelectors = paletteSlice.selectors;
