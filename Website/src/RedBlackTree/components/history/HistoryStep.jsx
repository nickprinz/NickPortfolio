
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "../../store/tree";
import HistoryEntry from "./HistoryEntry";


const getTextForStep = (step, nodes) => {
    if(!step) return "Finished";
    if(step.type === "compare"){
        const node1 = nodes[step.primaryIndex];
        const node2 = nodes[step.secondaryIndex];
        return `Compare ${node1.value} to ${node2.value}`;
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
    
    const dispatch = useDispatch();
    
    const {currentHistoryStep, nodes} = useSelector(state => {
        return state.tree;
    });
    
    const handleClick = () => {
        if(currentHistoryStep === historyStepIndex){
            dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:0}));
            return;   
        }
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:historyStepIndex}));
    }

    return <>
        <HistoryEntry onClick={handleClick} isActive={currentHistoryStep === historyStepIndex}>
            {getTextForStep(historyStep, nodes)}
        </HistoryEntry>
    </>

    return <>
        {historyRecord.type === "change" && <div>change</div>}
        {historyRecord.type === "compare" && <div>compare</div>}
        {historyRecord.type === "note" && <div>note</div>}
    </>
}