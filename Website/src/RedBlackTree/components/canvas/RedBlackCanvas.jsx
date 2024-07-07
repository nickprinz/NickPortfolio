import { useSelector } from "react-redux";
import ExteriorNodeElement from "./ExteriorNodeElement";
import LineBetween from "./LineBetween";
import RedBlackNodeElement from "./RedBlackNodeElement";
import { CanvasPositioner, getDisplaySection } from "./nodePositionHelper";

export default function RedBlackCanvas({ selectedIndex, onNodeClicked, width, height }) {
    const tree = useSelector(state => {
        return state.tree;
    });
    const { nodes, rootIndex } = tree;
    const activeHistoryStep = getActiveHistoryStep(tree);
    let focusedIndex = getFocusedIndex(activeHistoryStep);
    if(focusedIndex === null) focusedIndex = selectedIndex;

    const positionerTop = getDisplaySection(focusedIndex, nodes, rootIndex);
    const canvasPositioner = new CanvasPositioner(width, height);

    const makeLine = (key, fromPoint, toPoint) => {
        return <LineBetween key={key} fromPoint={canvasPositioner.toCanvasSpace(fromPoint)} toPoint={canvasPositioner.toCanvasSpace(toPoint)}/>;
    }

    const makeNode = (positioner, id, parentPoint, nodes, focusedIndex) => {
        const canvasPoint = canvasPositioner.toCanvasSpace({x: positioner.x, y: positioner.y});
        const parentCanvasPoint = canvasPositioner.toCanvasSpace({x: parentPoint.x, y: parentPoint.y});
        if(positioner.isNull){
            return <RedBlackNodeElement key={id} x={canvasPoint.x} y={canvasPoint.y} originX={parentCanvasPoint.x} originY={parentCanvasPoint.y} value={""} isSmall/>;
        }
        const node = nodes[positioner.index];
        if(positioner.out){
            return <ExteriorNodeElement key={id} onClick={() => onNodeClicked(node.index)} x={canvasPoint.x} y={canvasPoint.y} originX={parentCanvasPoint.x} originY={parentCanvasPoint.y} childCount={node.childCount+1} depth={node.depthBelow+1} />;
        }
        return <RedBlackNodeElement key={id} onClick={() => onNodeClicked(node.index)} x={canvasPoint.x} y={canvasPoint.y} value={node.value} isRed={node.isRed} selected={node.index === focusedIndex}/>;
    }

    const makeTopElements = () => {
        const topElements = [];
        const topParentNode = nodes[nodes[positionerTop?.index]?.parent];
        if(topParentNode){
            let topNode = nodes[positionerTop.index];
            const topLeftChild = topParentNode.left === topNode.index;
            const topParentPositioner = {x:positionerTop.x + (topLeftChild?.2:-.2), y:positionerTop.y - .5, index:topParentNode.index, out:true}
            topElements.push(makeLine(`${topParentNode?.id}-line-to-${topLeftChild?"left":"right"}`, {x: topParentPositioner.x, y: topParentPositioner.y},  {x: positionerTop.x, y: positionerTop.y}));
            //need to adjust depth and childcount being passed in to count all above instead of all below
            topElements.push(makeNode(topParentPositioner, topParentNode.id, {x: topParentPositioner.x, y: topParentPositioner.y}, nodes, focusedIndex));
        }
        return topElements;
    }

    const getHistoryStepElements = (currentPositioner) => {
        const extraNode = getExtraNode(activeHistoryStep,tree);
        const extraElements = [];
        if(!extraNode) return extraElements;
        //need to add notes for the active history step
        //need to have a different node element type capable of repeating animations
        extraElements.push(makeNode({index: extraNode.index, x: currentPositioner.x + .25, y: currentPositioner.y}, "extra-"+extraNode.id, {x: currentPositioner.x + .05, y: currentPositioner.y}, nodes, focusedIndex));
        
        return extraElements;
    }

    const displayThings = [...makeTopElements()];
    const parentStack = [];

    let nextPositioner = positionerTop;
    let leftChild = true;
    let lastParent = positionerTop;
    while(nextPositioner !== null){
        let nextNode = nodes[nextPositioner.index];
        if(nextPositioner.isNull || nextPositioner.out){
            const endKeyText = nextNode ? nextNode.id : `${lastParent.index}-null-${leftChild?"left":"right"}`;
            displayThings.push(makeNode(nextPositioner, endKeyText, {x: lastParent.x, y: lastParent.y}, nodes, focusedIndex));
            if(parentStack.length === 0){
                break;
            }
            let stackedParent = parentStack.pop()
            lastParent = stackedParent;
            leftChild = false;
            nextPositioner = stackedParent.right;
            nextNode = nodes[nextPositioner.index];
            if(nextPositioner.isNull || nextPositioner.out) continue;
        }
        
        const node = nodes[nextPositioner.index];
        displayThings.push(makeNode(nextPositioner, nextNode.id,{x: nextPositioner.x, y: nextPositioner.y}, nodes, focusedIndex));
        if(nextPositioner.index === focusedIndex){
            displayThings.push(...getHistoryStepElements(nextPositioner));
        }
        displayThings.push(makeLine(`${node.id}-line-to-left`, {x:nextPositioner.x, y : nextPositioner.y},  {x:nextPositioner.left.x, y : nextPositioner.left.y}));
        displayThings.push(makeLine(`${node.id}-line-to-right`, {x:nextPositioner.x, y : nextPositioner.y},  {x:nextPositioner.right.x, y : nextPositioner.right.y}));
        parentStack.push(nextPositioner);
        lastParent = nextPositioner;
        leftChild = true;
        nextPositioner = nextPositioner.left;
    }
  
    return <div >
            {displayThings}
        </div>
}

function getActiveHistoryStep(tree){
    let activeAction = tree.history[tree.currentHistoryAction];
    if(!activeAction) return null;
    let activeStep = activeAction.steps[tree.currentHistoryStep];
    if(activeStep) return activeStep;
    //below prevents actual errors, but I think a finished step needs to be added for each action
    //moving to the next step just shows a preview too soon
    activeAction = tree.history[tree.currentHistoryAction-1];
    if(!activeAction) return null;
    return activeAction.steps[0];
}

function getFocusedIndex(activeHistoryStep){
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
}

function getExtraNode(activeHistoryStep, tree){
    if(!activeHistoryStep) return null;
    if(activeHistoryStep.type === "compare"){
        return tree.nodes[activeHistoryStep.primaryIndex];
    }
    if(activeHistoryStep.type === "change"){
        return tree.nodes[activeHistoryStep.index];
    }
    return null
}