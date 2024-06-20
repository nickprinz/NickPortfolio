import { createSlice } from '@reduxjs/toolkit';
import { add as treeAdd, remove as treeRemove, removeIndex as treeRemoveIndex } from './treeHelper';

export function makeInitialTreeState(){
    return {
        nodes: [],
        rootIndex: -1,
        freeIndexes: [],
        history: [],
    };
}

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
            treeAdd(action.payload.value, state);
        },
        remove(state, action){
            treeRemove(action.payload.value, state);
        },
        removeIndex(state, action){
            treeRemoveIndex(action.payload.index, state);
        },
        clear(state, action){
            state.nodes = [];
            state.rootIndex = -1;
            state.freeIndexes = [];
            state.history = [];
        },
    }
});

export default treeSlice.reducer;
export const treeActions = treeSlice.actions
