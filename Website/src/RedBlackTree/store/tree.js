import { createSlice } from '@reduxjs/toolkit';
import { add as treeAdd, remove as treeRemove, removeIndex as treeRemoveIndex, makeInitialTreeState, moveHistory as treeMoveHistory, moveHistoryToCurrent, moveHistoryToLast } from './treeHelper';

const treeSlice = createSlice({
    name:"tree",
    initialState: makeInitialTreeState(),
    reducers:{
        add(state, action){
            if(Array.isArray(action.payload.value)){
                action.payload.value.forEach(v => {
                    treeAdd(v, state);
                });
                return;
            }
            const addedIndex = treeAdd(action.payload.value, state);
            action.payload.index = addedIndex;
        },
        remove(state, action){
            treeRemove(action.payload.value, state);
        },
        removeIndex(state, action){
            treeRemoveIndex(action.payload.index, state);
        },
        moveHistory(state, action){
            treeMoveHistory(action.payload.amount, state);
        },
        moveHistoryCurrent(state, action){
            moveHistoryToCurrent(state);
        },
        moveHistoryToStart(state, action){
            moveHistoryToLast(state);
        },
        clear(state, action){
            const blankTree = makeInitialTreeState();
            Object.keys(blankTree).forEach((k) => {
                state[k] = blankTree[k];
            })
        },
    }
});

export default treeSlice.reducer;
export const treeActions = treeSlice.actions
