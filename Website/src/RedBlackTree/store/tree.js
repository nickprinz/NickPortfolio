import { createSlice } from '@reduxjs/toolkit';
import { add as treeAdd, 
    addMany as treeAddMany, 
    remove as treeRemove, 
    removeIndex as treeRemoveIndex, 
    makeInitialTreeState, 
    moveHistory as treeMoveHistory, 
    moveHistoryToCurrent, 
    moveHistoryToLast, 
    setHistoryToPosition, 
    getClosestReplacement as treeGetClosestReplacement } from './treeHelper';

const treeSlice = createSlice({
    name:"tree",
    initialState: makeInitialTreeState(),
    reducers:{
        add(state, action){
            if(Array.isArray(action.payload.value)){
                const rootAfter = treeAddMany(action.payload.value, state);
                action.payload.index = rootAfter;
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
    },
    selectors:{
        getActiveHistoryStep(state){
            let activeAction = state.history.actions[state.history.currentHistoryAction];
            if(!activeAction) return null;
            let activeStep = activeAction.steps[state.history.currentHistoryStep];
            if(activeStep) return activeStep;
            //below prevents actual errors, but I think a finished step needs to be added for each action
            //moving to the next step just shows a preview too soon
            activeAction = state.history.actions[state.history.currentHistoryAction-1];
            if(!activeAction) return null;
            return activeAction.steps[0];
        },
        getActiveHistoryActionIndex(state){
            return state.history.currentHistoryAction;
        },
        getActiveHistoryStepIndex(state){
            return state.history.currentHistoryStep;
        },
        getClosestReplacement(state, removeIndex){
            return treeGetClosestReplacement(removeIndex, state);
        },
        getRealLength(state){
            return state.nodes.length - state.freeIndexes.length;
        },
        getRootIndex(state){
            return state.rootIndex;
        },
    }
});

export default treeSlice.reducer;
export const treeActions = treeSlice.actions;
export const treeSelectors = treeSlice.selectors;
