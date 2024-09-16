import { Action, PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { HSVtoRGB, HSVtoRGBHex, RBGtoHex, RGBtoHSV } from './colorHelpers';
import { PaletteValue } from '../interfaces/paletteValue';
import { Color } from '../interfaces/color';
import { Hsv } from '../interfaces/hsv';
import { createGridFromState } from './createGridFromState';
import { ShowText } from './showText';
import { fillAdjustments, fillGridColumnAdjustments, fillGridRowAdjustments, makeBlankGrid } from './gridAdjustments';
import { makeBlanks } from './gridAdjustments';

export interface ColorGrid{
    colors: string[][],
}

//need to add cell, row, and column adjustments
export interface PaletteState{
    seed: Color,
    rowCount: number,
    shadeCount: number,
    hueShift: number,
    highSat: number,
    highValue: number,
    lowSat: number,
    lowValue: number,
    showText: ShowText,
    columnAdjustments: Hsv[],
    rowAdjustments: Hsv[],
    cellAdjustments: Hsv[][],
    activeCell: string|null,
}

const makeDefaultState = (): PaletteState => {
    const rowCount = 4;
    const columnCount = 5;
    return {
        seed:HSVtoRGB({h:0,s:60,v:55}), 
        rowCount:rowCount, 
        shadeCount:columnCount, 
        hueShift:20,
        highSat:30,
        highValue:80,
        lowSat:60,
        lowValue:30,
        showText: ShowText.None,
        columnAdjustments: makeBlanks(columnCount),
        rowAdjustments: makeBlanks(rowCount),
        cellAdjustments: makeBlankGrid(rowCount,columnCount),
        activeCell: null,
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
            if(action.payload < 0 || action.payload > 50) return;
            state.rowCount = action.payload;
            state.rowAdjustments = fillAdjustments(state.rowAdjustments, action.payload);
            state.cellAdjustments = fillGridRowAdjustments(state.cellAdjustments, action.payload, state.shadeCount);
        },
        setColumnCount(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < 0 || action.payload > 50) return;
            state.shadeCount = action.payload;
            state.columnAdjustments = fillAdjustments(state.columnAdjustments, action.payload);
            state.cellAdjustments = fillGridColumnAdjustments(state.cellAdjustments, action.payload);
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
        setShowText(state: PaletteState, action: PayloadAction<ShowText>){
            state.showText = action.payload;
        },
        setActiveCell(state: PaletteState, action: PayloadAction<string>){
            if(state.activeCell === action.payload){
                state.activeCell = null;
                return;
            }
            state.activeCell = action.payload;
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
        getShowText: (state) => {
            return state.showText;
        },
        getActiveCell: (state) => {
            return state.activeCell;
        },
        getIsCellActive: createSelector(
            [((state) => state.activeCell), ((state, cellId) => cellId)],
            (activeCell, cellId) => {
                return activeCell === cellId;
            }
        ),
    }
});

export default paletteSlice.reducer;
export const paletteActions = paletteSlice.actions;
export const paletteSelectors = paletteSlice.selectors;
