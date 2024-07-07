
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "../../store/tree";
import HistoryEntry from "./HistoryEntry";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function HistoryStep({historyStep, historyStepIndex, historyActionIndex}){
    // {
    //     type:"change",
    //     index:nodeIndex,
    //     attribute:attributeName,
    //     value:attributeValue,
    //     oldValue:old,
    // }
    // {
    //     type:"compare",
    //     primaryIndex:primaryNodeIndex,
    //     secondaryIndex:SecondaryNodeIndex,
    // }
    // {
    //     type:"note",
    //     index:nodeIndex,
    //     note:note,
    // }
    
    const { t: translate } = useTranslation("red_black");
    const dispatch = useDispatch();
    
    const {currentHistoryStep, nodes} = useSelector(state => {
        return state.tree;
    });
    const isActiveStep = currentHistoryStep === historyStepIndex;
    const handleClick = useCallback(() => {
        if(isActiveStep){
            dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:0}));
            return;   
        }
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:historyStepIndex}));
    }, [isActiveStep])

    return <>
        <HistoryEntry onClick={handleClick} isActive={isActiveStep}>
            {getTextForStep(historyStep, nodes, translate)}
        </HistoryEntry>
    </>
}
const getTextForStep = (step, nodes, translate) => {
    if(!step) return "Finished";
    if(step.type === "compare"){
        const node1 = nodes[step.primaryIndex];
        const node2 = nodes[step.secondaryIndex];
        return translate("compare_values", {value1: node1.value, value2: node2.value})
    }
    if(step.type === "change"){
        const node = nodes[step.index];
        if(step.attribute === "rotateRight"){
            return `Rotate Right on ${node.value} ${step.value ? "swapping colors" : ""}`;
        }
        if(step.attribute === "rotateLeft"){
            return `Rotate Left on ${node.value} ${step.value ? "swapping colors" : ""}`;
        }
        if(step.attribute === "parent"){
            //if oldValue is -1 its just setting parent
            return `Reparent ${node.value}`;
        }
        if(step.attribute === "isRed"){
            return `Recolor ${node.value} to ${step.value ? "Red" : "Black"}`;
        }

    }
    return step.type;
};