import { Action, PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { HSVtoRGB, HSVtoRGBHex, RBGtoHex, RGBtoHSV } from './colorHelpers';
import { Color } from '../interfaces/color';
import { Hsv } from '../interfaces/hsv';
import { createCellFromState } from './createCellFromState';
import { ShowText } from './showText';
import { fillAdjustments, fillDirections, fillGridColumnAdjustments, fillGridRowAdjustments, makeBlankGrid, makeDirections } from './gridAdjustments';
import { makeBlanks } from './gridAdjustments';
import { ColorCell } from '../interfaces/colorCell';

//need to add cell, row, and column adjustments
export interface PaletteState{
    seed: Color,
    rowCount: number,
    shadeCount: number,
    hueShift: number,
    hueShiftDirections: boolean[],
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

interface Position{
    X: number,
    Y: number,
}

const getIndexesFromId = (id: string) : Position => {
    const parts: string[] = id.split("#");
    return {X: parseInt(parts[1]), Y: parseInt(parts[2])};
}

const makeDefaultState = (): PaletteState => {
    const rowCount = 4;
    const columnCount = 5;
    return {
        seed:HSVtoRGB({h:0,s:60,v:55}), 
        rowCount:rowCount, 
        shadeCount:columnCount, 
        hueShift:20,
        hueShiftDirections:makeDirections(rowCount),
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
            state.hueShiftDirections = fillDirections(state.hueShiftDirections, action.payload);
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
        setHueShiftDirection(state: PaletteState, action: PayloadAction<number>){
            state.hueShiftDirections[action.payload] = !state.hueShiftDirections[action.payload];//add safety checks
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
        setActiveCellAdjustments(state: PaletteState, action: PayloadAction<Hsv>){
            if(!state.activeCell) return;
            const activeIndexes = getIndexesFromId(state.activeCell);
            state.cellAdjustments[activeIndexes.X][activeIndexes.Y] = action.payload;
        },
    },
    selectors:{
        getColorCell: createSelector(
            [
                ((state: PaletteState) => state), 
                ((state: PaletteState, rowNumber:number) => rowNumber),
                ((state: PaletteState, rowNumber:number, columnNumber:number) => columnNumber)
            ],
            (state, rowNumber, columnNumber): ColorCell => {
                return createCellFromState(state, rowNumber, columnNumber);
        }),
        getRowCount: (state: PaletteState) => {
            return state.rowCount;
        },
        getColumnCount: (state: PaletteState) => {
            return state.shadeCount;
        },
        getSeedColor: (state: PaletteState) => {
            return state.seed;
        },
        getSeedColorHex: (state: PaletteState) => {
            return RBGtoHex(state.seed) ;
        },
        getHueShift: (state: PaletteState) => {
            return state.hueShift;
        },
        getLowSat: (state: PaletteState) => {
            return state.lowSat;
        },
        getLowVal: (state: PaletteState) => {
            return state.lowValue;
        },
        getHighSat: (state: PaletteState) => {
            return state.highSat;
        },
        getHighVal: (state: PaletteState) => {
            return state.highValue;
        },
        getShowText: (state: PaletteState): ShowText => {
            return state.showText;
        },
        getActiveCell: (state: PaletteState) => {
            return state.activeCell;
        },
        getActiveCellAdjustments: createSelector(
            [((state: PaletteState) => state)],
            (state: PaletteState): Hsv|null => {
                if(!state.activeCell) return null;
                const activeIndexes = getIndexesFromId(state.activeCell);
                return state.cellAdjustments[activeIndexes.X][activeIndexes.Y];
        }),
        getIsCellActive: createSelector(
            [((state: PaletteState) => state.activeCell), ((state: PaletteState, cellId) => cellId)],
            (activeCell, cellId): boolean => {
                return activeCell === cellId;
            }
        ),
    }
});

export default paletteSlice.reducer;
export const paletteActions = paletteSlice.actions;
export const paletteSelectors = paletteSlice.selectors;
