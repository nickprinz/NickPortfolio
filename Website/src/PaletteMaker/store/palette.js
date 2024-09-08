import { createSelector, createSlice } from '@reduxjs/toolkit';
import { HSVtoRGBHex } from './colorHelpers';

const makeDefaultState = () => {
    return {colors: makeNewGrid(0,4,5,100,30,40,90)}
}

const makeNewGrid = (startHue, rows, columns, lowSat, lowValue, highSat, highValue) => {
    
    const rowHueChange = 360/rows;

    const grid = [];
    for (let i = 0; i < rows; i++) {
        const hue = (startHue + rowHueChange*i)%360;
        grid.push(makeNewRow(hue, columns, lowSat, lowValue, highSat, highValue));
    }

    return grid;
}

const makeNewRow = (startHue, columns, lowSat, lowValue, highSat, highValue) => {
    let row = [];
    const perColumn = 1/Math.max(columns-1,1);
    for (let i = 0; i < columns; i++) {
        const sat = lerp(lowSat, highSat, perColumn*i);
        const val = lerp(lowValue, highValue, perColumn*i);
        row.push(HSVtoRGBHex(startHue,sat,val));
    }
    return row;
}

const lerp = ( a, b, t ) => {
    return a + t * ( b - a );
}

const paletteSlice = createSlice({
    name:"palette",
    initialState: makeDefaultState(),
    reducers:{
        clear(state, action){
            return {};
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
