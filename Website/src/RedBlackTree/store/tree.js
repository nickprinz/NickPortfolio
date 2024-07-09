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

import { getDisplaySection, getDisplaySection2 } from './getDisplaySection';

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
        getActiveHistoryStep(state){
            return getActiveHistoryStep(state);
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
        getTextForHistoryStep(state, actionIndex, stepIndex){
            const history = state.history;
            const result = {textkey:"" , params:{}};
            const action = history.actions[actionIndex];
            if(!action) return result;
            const step = action.steps[stepIndex];
            if(!step){
                result.textkey = "finished";
                return result;
            }
            
            if(step.type === "compare"){
                result.textkey = "compare_values";
                const node1 = state.nodes[step.primaryIndex];
                const node2 = state.nodes[step.secondaryIndex];
                result.params = {value1: node1.value, value2: node2.value};
                return result;
            }

            if(step.type === "change"){
                if(step.attribute === "root"){
                    result.textkey = "set_root";
                    const node1 = state.nodes[step.oldValue];
                    const node2 = state.nodes[step.value];
                    result.params = {value1: node1 ? node1.value : "empty", value2: node2 ? node2.value : "empty"};
                    return result;
                }
                const node = state.nodes[step.index];
                result.params = {value: node.value};
                if(step.attribute === "rotateRight"){
                    result.textkey = "rotate_right";
                    if(step.value){
                        result.textkey += "_color_swap";
                    }
                    return result;
                }
                if(step.attribute === "rotateLeft"){
                    result.textkey = "rotate_left";
                    if(step.value){
                        result.textkey += "_color_swap";
                    }
                    return result;
                }
                if(step.attribute === "parent"){
                    result.textkey = "set_parent";
                    const parentNode = state.nodes[step.value];
                    result.params.parent = parentNode ? parentNode.value : "empty";//actually need a new text key if empty
                    return result;
                }
                if(step.attribute === "isRed"){
                    result.textkey = step.value ? "set_red" : "set_black";
                    return result;
                }
                result.textkey = step.attribute;
                return result;

            }
            result.textkey = step.type;
            return result;
        },
        getHistoryFocusedIndex(state){
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
        getDisplaySection(state, focusedIndex){
            return getDisplaySection(focusedIndex, state.nodes, state.rootIndex);
        },
        getDisplaySection2(state, focusedIndex){
            return getDisplaySection2(focusedIndex, state.nodes, state.rootIndex);
        }
    }
});

export default treeSlice.reducer;
export const treeActions = treeSlice.actions;
export const treeSelectors = treeSlice.selectors;
