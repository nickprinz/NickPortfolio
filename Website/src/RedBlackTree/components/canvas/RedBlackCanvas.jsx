import { useSelector } from "react-redux";
import ExteriorNodeElement from "./ExteriorNodeElement";
import LineBetween from "./LineBetween";
import RedBlackNodeElement from "./RedBlackNodeElement";

export default function RedBlackCanvas({ selectedIndex, onNodeClicked, width, height }) {
    const centerX = width/2;
    const halfWidth = centerX - 20;
    const changeY = height/8;
    const tree = useSelector(state => {
        return state.tree;
    });
    const { nodes, rootIndex } = tree;
    const activeHistoryStep = getActiveHistoryStep(tree);
    let focusedIndex = getFocusedIndex(activeHistoryStep);
    if(focusedIndex === null) focusedIndex = selectedIndex;
    const positionerTop = getDisplaySection(focusedIndex, nodes, rootIndex);

    const toCanvasSpace = ({x,y}) => {
        let cx = centerX + (halfWidth*x);
        let cy = changeY * y;
        return {x: cx, y: cy};
    }

    function makeLine(key, fromPoint, toPoint){
        return <LineBetween key={key} fromPoint={toCanvasSpace(fromPoint)} toPoint={toCanvasSpace(toPoint)}/>
    }

    function makeNode(positioner, id, parentPoint){
        const canvasPoint = toCanvasSpace({x: positioner.x, y: positioner.y});
        const parentCanvasPoint = toCanvasSpace({x: parentPoint.x, y: parentPoint.y});
        if(positioner.isNull){
            return <RedBlackNodeElement key={id} x={canvasPoint.x} y={canvasPoint.y} originX={parentCanvasPoint.x} originY={parentCanvasPoint.y} value={""} isSmall/>;
        }
        const node = nodes[positioner.index];
        if(positioner.out){
            return <ExteriorNodeElement key={id} onClick={() => onNodeClicked(node.index)} x={canvasPoint.x} y={canvasPoint.y} originX={parentCanvasPoint.x} originY={parentCanvasPoint.y} childCount={node.childCount+1} depth={node.depthBelow+1} />;
        }
        return <RedBlackNodeElement key={id} onClick={() => onNodeClicked(node.index)} x={canvasPoint.x} y={canvasPoint.y} value={node.value} isRed={node.isRed} selected={node.index === focusedIndex}/>;
    }

    const displayThings = []
    const parentStack = [];
    const topParentNode = nodes[nodes[positionerTop?.index]?.parent];
    if(topParentNode){
        //need to add an out node and line for top parent
        let topNode = nodes[positionerTop.index];
        const topLeftChild = topParentNode.left === topNode.index;
        const topParentPositioner = {x:positionerTop.x + (topLeftChild?.2:-.2), y:positionerTop.y - .5, index:topParentNode.index, out:true}
        displayThings.push(makeLine(`${topParentNode?.id}-line-to-${topLeftChild?"left":"right"}`, {x: topParentPositioner.x, y: topParentPositioner.y},  {x: positionerTop.x, y: positionerTop.y}));
        //need to adjust depth and childcount being passed in to count all above instead of all below
        displayThings.push(makeNode(topParentPositioner, topParentNode.id, {x: topParentPositioner.x, y: topParentPositioner.y}));

    }

    let nextPositioner = positionerTop;
    let leftChild = true;
    let lastParent = positionerTop;
    while(nextPositioner !== null){
        let nextNode = nodes[nextPositioner.index];
        if(nextPositioner.isNull || nextPositioner.out){
            const endKeyText = nextNode ? nextNode.id : `${lastParent.index}-null-${leftChild?"left":"right"}`;
            displayThings.push(makeNode(nextPositioner, endKeyText, {x: lastParent.x, y: lastParent.y}));
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
        displayThings.push(makeNode(nextPositioner, nextNode.id,{x: nextPositioner.x, y: nextPositioner.y}));
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
    const activeAction = tree.history[tree.currentHistoryAction];
    if(!activeAction) return null;
    const activeStep = activeAction.steps[tree.currentHistoryStep];
    return activeStep;
}

function getDisplaySection(focusedIndex, nodes, rootIndex){
    if(focusedIndex === -1) return null;
    let focusedNode = nodes[focusedIndex];
    if(focusedIndex === rootIndex){
        let top = getChildrenBelow(focusedIndex, 1, 0, 4, nodes);
        return top;
    } else if(focusedNode.parent === rootIndex){
        return getDisplaySectionOneBelowRoot(focusedNode, nodes);
    } else{
        return getDisplaySectionTwoOrMoreBelowRoot(focusedNode, nodes);
    }
}

function getDisplaySectionOneBelowRoot(focusedNode, nodes){
    let parentNode = nodes[focusedNode.parent];
    let isLeftChild = parentNode.left === focusedNode.index;
    let focused = getChildrenBelow(focusedNode.index, 2, isLeftChild ? -.15 : .15, 3, nodes);
    let top = {index: parentNode.index, y:1, x:0, left:makeNull(), right:makeNull()};
    if(isLeftChild){
        top.x = focused.x + .5;
        top.left = focused;
        top.right = getChildrenBelow(parentNode.right, 2, top.x + .25, 2, nodes);
    } else{
        top.x = focused.x + -.5;
        top.right = focused;
        top.left = getChildrenBelow(parentNode.left, 2, top.x - .25, 2, nodes);
    }
    return top;
}
function getDisplaySectionTwoOrMoreBelowRoot(focusedNode, nodes){
    let parentNode = nodes[focusedNode.parent];
    let isLeftChild = parentNode.left === focusedNode.index;
    let topNode = nodes[parentNode.parent];
    let isParentLeftChild = topNode.left === parentNode.index;
    let focusedX = isParentLeftChild ? -.2 : .2;
    focusedX += isLeftChild ? -.1 : .1;
    let focused = getChildrenBelow(focusedNode.index, 3, focusedX, 2, nodes);
    let focusedParent = {index: parentNode.index, y:2, x:0, left:makeNull(), right:makeNull()};
    if(isLeftChild){
        focusedParent.x = focused.x + .25;
        focusedParent.left = focused;
        focusedParent.right = getChildrenBelow(parentNode.right, 3, focused.x + .5, 2, nodes);
    } else{
        focusedParent.x = focused.x + -.25;
        focusedParent.right = focused;
        focusedParent.left = getChildrenBelow(parentNode.left, 3, focused.x - .5, 2, nodes);
    }
    let top = {index: topNode.index, y:1, x:0, left:makeNull(), right:makeNull()};
    if(isParentLeftChild){
        top.x = focusedParent.x + .45;
        top.left = focusedParent;
        top.right = getChildrenBelow(topNode.right, 2, top.x + .32, 2, nodes);
    } else{
        top.x = focusedParent.x - .45;
        top.right = focusedParent;
        top.left = getChildrenBelow(topNode.left, 2, top.x - .32, 2, nodes);
    }
    return top;
}

function getChildrenBelow(index, currentY, currentX, moreLevels, nodes){
    if(index === -1) return makeNull(currentX, currentY);
    const node = nodes[index];
    const xDiff = Math.pow(2,moreLevels-1)*0.0625;//3=.5 2=.25 1=.125
    const value = {index: index, y:currentY, x:currentX, left:makeNull(currentX-xDiff,currentY+1), right:makeNull(currentX+xDiff,currentY+1)};
    if(moreLevels == 0){
        value.out = true;
        return value;
    }
    if(node.left !== -1){
        value.left = getChildrenBelow(node.left, currentY+1, currentX-xDiff,moreLevels-1,nodes);
    }
    if(node.right !== -1){
        value.right = getChildrenBelow(node.right, currentY+1, currentX+xDiff,moreLevels-1,nodes);
    }

    return value;
}

function makeNull(x,y){
    return {isNull: true, x:x, y:y};
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