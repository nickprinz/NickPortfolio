import { Action, PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { HSVtoRGB, HSVtoRGBHex, RBGtoHex, RGBtoHSV } from './colorHelpers';
import { Color } from '../interfaces/color';
import { Hsv } from '../interfaces/hsv';
import { createCellFromState } from './createCellFromState';
import { ShowText } from './showText';
import { fillAdjustments, fillDirections, fillGridColumnAdjustments, fillGridRowAdjustments, } from './gridAdjustments';
import { ColorCell } from '../interfaces/colorCell';
import { PrimaryColors } from './primaryColors';

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
    primaryColors: PrimaryColors,
    columnAdjustments: Hsv[],
    rowAdjustments: Hsv[],
    cellAdjustments: Hsv[][],
    activeCell: string|null,
    desaturatedRows: boolean,
    desaturatedPercent: number,
}

interface Position{
    X: number,
    Y: number,
}

const getIndexesFromId = (id: string) : Position => {
    const parts: string[] = id.split("#");
    return {X: parseInt(parts[1]), Y: parseInt(parts[2])};
}

export const fixAdjustments = (state: PaletteState) => {
    let fullRowCount = state.rowCount;
    if(state.desaturatedRows) fullRowCount = state.rowCount*2;
    state.rowAdjustments = fillAdjustments(state.rowAdjustments, fullRowCount);
    state.hueShiftDirections = fillDirections(state.hueShiftDirections, state.rowCount);
    state.columnAdjustments = fillAdjustments(state.columnAdjustments, state.shadeCount);
    state.cellAdjustments = fillGridColumnAdjustments(state.cellAdjustments, state.shadeCount);
    state.cellAdjustments = fillGridRowAdjustments(state.cellAdjustments, fullRowCount, state.shadeCount);
}

//need to figure out desaturated rows
//checking the box will double the rowCount, but should not be done by changing state.rowCount
//this will change the adjustment grids
//desat rows will not have their own hueShiftDirections, but will look at their index-rowcount position
//desat cells will get adjustments first from their sat counterpart and then their own, without double counting column
//change fillAdjustments to take in row count and desat rows. ideally I would like one place to perform the doubling math

const makeDefaultState = (): PaletteState => {
    const rowCount = 6;
    const columnCount = 5;
    const defaultState = {
        seed:HSVtoRGB({h:0,s:60,v:55}), 
        rowCount:rowCount,
        shadeCount:columnCount, 
        hueShift:20,
        hueShiftDirections:[],
        highSat:30,
        highValue:80,
        lowSat:60,
        lowValue:20,
        showText: ShowText.None,
        primaryColors: PrimaryColors.RYB,
        columnAdjustments: [],
        rowAdjustments: [],
        cellAdjustments: [],
        activeCell: null,
        desaturatedRows: false,
        desaturatedPercent: .35,
    };
    fixAdjustments(defaultState);
    return defaultState;
}

const paletteSlice = createSlice({
    name:"palette",
    initialState: makeDefaultState(),
    reducers:{
        reset(state: PaletteState, action){
            const defaultState = makeDefaultState();
            //redux does not persist a directly assigned state, so instead iterate through keys
            Object.keys(defaultState).forEach((key) => {
                state[key] = defaultState[key];
            });
        },
        setRowCount(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < 0 || action.payload > 50) return;
            state.rowCount = action.payload;
            fixAdjustments(state);
        },
        setColumnCount(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < 0 || action.payload > 50) return;
            state.shadeCount = action.payload;
            fixAdjustments(state);
        },
        setSeedColor(state: PaletteState, action: PayloadAction<Color>){
            if(action.payload.r < 0 || action.payload.r > 255) return;
            if(action.payload.g < 0 || action.payload.g > 255) return;
            if(action.payload.b < 0 || action.payload.b > 255) return;
            state.seed = action.payload;
        },
        setHueShift(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < -180 || action.payload > 180) return;
            state.hueShift = action.payload;
        },
        setHueShiftDirection(state: PaletteState, action: PayloadAction<number>){
            state.hueShiftDirections[action.payload] = !state.hueShiftDirections[action.payload];//add safety checks
        },
        setLowSat(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < 0 || action.payload > 100) return;
            state.lowSat = action.payload;
        },
        setLowVal(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < 0 || action.payload > 100) return;
            state.lowValue = action.payload;
        },
        setHighSat(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < 0 || action.payload > 100) return;
            state.highSat = action.payload;
        },
        setHighVal(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < 0 || action.payload > 100) return;
            state.highValue = action.payload;
        },
        setShowText(state: PaletteState, action: PayloadAction<ShowText>){
            state.showText = action.payload;
        },
        setPrimaryColors(state: PaletteState, action: PayloadAction<PrimaryColors>){
            state.primaryColors = action.payload;
        },
        setActiveCell(state: PaletteState, action: PayloadAction<string>){
            if(state.activeCell === action.payload){
                state.activeCell = null;
                return;
            }
            state.activeCell = action.payload;
        },
        setDesaturatedRows(state: PaletteState, action: PayloadAction<boolean>){
            state.desaturatedRows = action.payload;
            fixAdjustments(state);
        },
        setDesaturatedPercent(state: PaletteState, action: PayloadAction<number>){
            if(action.payload < 0 || action.payload > 100) return;
            state.desaturatedPercent = action.payload/100;
        },
        setActiveCellAdjustments(state: PaletteState, action: PayloadAction<Hsv>){
            if(!state.activeCell) return;
            const activeIndexes = getIndexesFromId(state.activeCell);
            state.cellAdjustments[activeIndexes.X][activeIndexes.Y] = action.payload;
        },
        setActiveRowAdjustments(state: PaletteState, action: PayloadAction<Hsv>){
            if(!state.activeCell) return;
            const activeIndexes = getIndexesFromId(state.activeCell);
            state.rowAdjustments[activeIndexes.X] = action.payload;
        },
        setActiveColumnAdjustments(state: PaletteState, action: PayloadAction<Hsv>){
            if(!state.activeCell) return;
            const activeIndexes = getIndexesFromId(state.activeCell);
            state.columnAdjustments[activeIndexes.Y] = action.payload;
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
        getGridRowCount: (state: PaletteState) => {
            return state.rowAdjustments.length;
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
        getPrimaryColors: (state: PaletteState): PrimaryColors => {
            return state.primaryColors;
        },
        getActiveCell: (state: PaletteState) => {
            return state.activeCell;
        },
        getDesaturatedRows(state: PaletteState){
            return state.desaturatedRows;
        },
        getDesaturatedPercent(state: PaletteState){
            return state.desaturatedPercent * 100;
        },
        getActiveCellAdjustments: createSelector(
            [((state: PaletteState) => state)],
            (state: PaletteState): Hsv|null => {
                if(!state.activeCell || state.rowCount === 0 || state.shadeCount === 0) return null;
                const activeIndexes = getIndexesFromId(state.activeCell);
                if(activeIndexes.X >= state.cellAdjustments.length) return null;
                return state.cellAdjustments[activeIndexes.X][activeIndexes.Y];
        }),
        getActiveRowAdjustments: createSelector(
            [((state: PaletteState) => state)],
            (state: PaletteState): Hsv|null => {
                if(!state.activeCell) return null;
                const activeIndexes = getIndexesFromId(state.activeCell);
                return state.rowAdjustments[activeIndexes.X];
        }),
        getActiveColumnAdjustments: createSelector(
            [((state: PaletteState) => state)],
            (state: PaletteState): Hsv|null => {
                if(!state.activeCell) return null;
                const activeIndexes = getIndexesFromId(state.activeCell);
                return state.columnAdjustments[activeIndexes.Y];
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
