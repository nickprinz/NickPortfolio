import { createSelector, createSlice } from '@reduxjs/toolkit';
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

import { getDisplaySection } from './getDisplaySection';
import selectTextForHistoryStep from './selectors/selectTextForHistoryStep';

const getActiveHistoryStep = (state) => {
    let activeAction = state.history.actions[state.history.currentHistoryAction];
    if(!activeAction) return null;
    let activeStep = activeAction.steps[state.history.currentHistoryStep];
    if(activeStep) return activeStep;
    //below prevents actual errors, but I think a finished step needs to be added for each action
    //moving to the next step just shows a preview too soon
    activeAction = state.history.actions[state.history.currentHistoryAction-1];
    if(!activeAction) return null;
    return activeAction.steps[0];
}

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
        selectActiveHistoryStep(state){
            return getActiveHistoryStep(state);
        },
        selectActiveHistoryActionIndex(state){
            return state.history.currentHistoryAction;
        },
        selectActiveHistoryAction: createSelector(
            [((state) => state.history.actions), ((state) => state.history.currentHistoryAction)],
            (actions, currentHistoryAction) => {
                const action = actions[currentHistoryAction];
                if(!action) return null;
                return {id: action.id, index: currentHistoryAction, stepCount: action.steps.length}
            }),
        selectActiveHistoryStepIndex(state){
            return state.history.currentHistoryStep;
        },
        selectClosestReplacement(state, removeIndex){
            return treeGetClosestReplacement(removeIndex, state);
        },
        selectTreeLength(state){
            return state.nodes.length - state.freeIndexes.length;
        },
        selectTextForHistoryStep: createSelector([
            ((state) => state.history), 
            ((state) => state.nodes), 
            ((state, actionIndex) => actionIndex), 
            ((state, actionIndex, stepIndex) => stepIndex)], //use actionId to keep a consistent key
            (history, nodes, actionIndex, stepIndex) => {
                return selectTextForHistoryStep(history, nodes, actionIndex, stepIndex);
            }
        ),
        selectHistoryFocusedIndex(state){
            let activeHistoryStep = getActiveHistoryStep(state);
            if(!activeHistoryStep) return null;
            if(activeHistoryStep.type === "compare"){
                return activeHistoryStep.secondaryIndex;
            }
            if(activeHistoryStep.type === "change"){
                if(activeHistoryStep.attribute === "parent"){
                    return activeHistoryStep.value;
                }
                return activeHistoryStep.index;
            }
            return null
        },
        selectDisplaySection : createSelector([((state) => state.nodes), ((state, focusedIndex) => focusedIndex), ((state) => state.rootIndex)], 
        (nodes, focusedIndex, rootIndex) => {
            return getDisplaySection(focusedIndex, nodes, rootIndex);
        })
    }
});

export default treeSlice.reducer;
export const treeActions = treeSlice.actions;
export const treeSelectors = treeSlice.selectors;
