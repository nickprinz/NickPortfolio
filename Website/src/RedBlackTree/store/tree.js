import { createSlice } from '@reduxjs/toolkit';
import { add as treeAdd, addMany as treeAddMany, remove as treeRemove, removeIndex as treeRemoveIndex, makeInitialTreeState, moveHistory as treeMoveHistory, moveHistoryToCurrent, moveHistoryToLast, setHistoryToPosition } from './treeHelper';

const treeSlice = createSlice({
    name:"tree",
    initialState: makeInitialTreeState(),
    reducers:{
        add(state, action){
            if(Array.isArray(action.payload.value)){
                treeAddMany(action.payload.value, state);
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
        setHistoryPosition(state, action){
            setHistoryToPosition(action.payload.actionIndex, action.payload.stepIndex, state);
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
