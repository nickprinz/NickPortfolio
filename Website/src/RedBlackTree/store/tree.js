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

import selectDisplaySection from './selectors/selectDisplaySection';
import selectTextForHistoryStep from './selectors/selectTextForHistoryStep';
import selectTextForHistoryAction from './selectors/selectTextForHistoryAction';

const getActiveHistoryStep = (history) => {
    let activeAction = history.actions[history.currentHistoryAction];
    if(!activeAction) return null;
    let activeStep = activeAction.steps[history.currentHistoryStep];
    if(activeStep) return activeStep;
    if(history.currentHistoryStep === activeAction.steps.length){
        //need to add a finish step instead
        if(activeAction.name === "Add") {
            //this fails for the first add because step0 is changing the root
            return {
                type:"change",
                index:activeAction.steps[0].index || activeAction.steps[0].primaryIndex,
                attribute:"",
                value:"",
                oldValue: "",
            }
        }
    }
    if(history.currentHistoryStep === -1){
        return activeAction.steps[0];
    }
    activeAction = history.actions[history.currentHistoryAction-1];
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
            const removeReplacement = treeRemove(action.payload.value, state);
            action.payload.index = removeReplacement;
        },
        removeIndex(state, action){
            const removeReplacement = treeRemoveIndex(action.payload.index, state);
            action.payload.index = removeReplacement;
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
            return getActiveHistoryStep(state.history);
        },
        selectActiveHistoryStepNote(state){
            const step = getActiveHistoryStep(state.history);
            if(!step) return null;
            //don't just return string, will need to add values for the translator
            //in the case of compare step need value of nodes at primaryIndex and secondaryIndex
            //will also want to note if value is less or greater
            //add_compare_values_less or add_compare_values_greater
            return {note: step.note, values: step.noteValues};
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
            }
        ),
        selectHistoryActionList: createSelector(
            [((state) => state.history.actions),],
            (actions) => {
                const result = actions.map((x,i) => {return {id:x.id, index:i}})
                result.splice(0,0,{id:-1, index:-1});
                return result;
            }
        ),
        selectIsActiveHistoryStep: createSelector(
            [((state) => state.history.currentHistoryStep), ((state, stepId) => stepId)],
            (currentHistoryStep, stepId) => {
                return currentHistoryStep === stepId;
            }
        ),
        selectIsActiveHistoryAction: createSelector(
            [((state) => state.history.currentHistoryAction), ((state, actionIndex) => actionIndex)],
            (currentHistoryAction, actionIndex) => {
                return currentHistoryAction === actionIndex;
            }
        ),
        selectClosestReplacement(state, removeIndex){
            return treeGetClosestReplacement(removeIndex, state);
        },
        selectTreeHasAtLeastOne(state){
            return state.rootIndex !== -1;
        },
        selectTextForHistoryStep: createSelector([
            ((state) => state.history.actions), 
            ((state) => state.nodes), 
            ((state, actionIndex) => actionIndex), 
            ((state, actionIndex, stepIndex) => stepIndex)], //use actionId to keep a consistent key
            (actions, nodes, actionIndex, stepIndex) => {
                return selectTextForHistoryStep(actions, nodes, actionIndex, stepIndex);
            }
        ),
        selectTextForHistoryAction: createSelector([
            ((state, actionIndex) => state.history.actions[actionIndex])], //use actionId to keep a consistent key
            (action) => {
                return selectTextForHistoryAction(action);
            }
        ),
        selectHistoryFocusedIndex(state){
            let activeHistoryStep = getActiveHistoryStep(state.history);
            //if this is a finished step, need to find the best index to select
            if(!activeHistoryStep) return null;
            if(activeHistoryStep.type === "compare"){
                return activeHistoryStep.secondaryIndex;
            }
            if(activeHistoryStep.type === "change"){
                return activeHistoryStep.index;
            }
            if(activeHistoryStep.type === "parent"){
                if(activeHistoryStep.parentIndex !== -1) return activeHistoryStep.parentIndex;
                if(activeHistoryStep.oldParentIndex !== -1) return activeHistoryStep.oldParentIndex;
                return activeHistoryStep.index;
            }
            if(activeHistoryStep.type === "swap"){
                return activeHistoryStep.primaryIndex;
            }
            if(activeHistoryStep.type === "finished"){
                return activeHistoryStep.index;
            }
            return null
        },
        selectDisplaySection : createSelector([((state) => state.nodes), ((state, focusedIndex) => focusedIndex), ((state) => state.rootIndex),
            ((state) => state.history),
        ], 
        (nodes, focusedIndex, rootIndex, history) => {
            let activeHistoryStep = getActiveHistoryStep(history);
            const section = selectDisplaySection(focusedIndex, nodes, rootIndex, activeHistoryStep);
            return section;
        })
    }
});

export default treeSlice.reducer;
export const treeActions = treeSlice.actions;
export const treeSelectors = treeSlice.selectors;
