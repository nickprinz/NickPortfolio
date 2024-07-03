import { useSelector } from "react-redux";
import ExteriorNodeElement from "./ExteriorNodeElement";
import LineBetween from "./LineBetween";
import RedBlackNodeElement from "./RedBlackNodeElement";
import { getTreeSection } from "../../store/treeHelper";

export default function RedBlackCanvas({ selectedIndex, onNodeClicked, width, height }) {
    const centerX = width/2;
    const changeY = height/8;
    const changeX = (width-30)/2;
    const topY = 50;
    const tree = useSelector(state => {
        return state.tree;
    });
    const { nodes, rootIndex } = tree;
    const activeHistoryStep = getActiveHistoryStep(tree);
    let focusedIndex = getFocusedIndex(activeHistoryStep);
    if(focusedIndex === null) focusedIndex = selectedIndex;

    //getTreeSection probably doesn't below in the tree
    //also need a better tree section. when showing the root, current behavior is fine
    //want to try to center the selected node better, which could be done when farther on the tree by not showing the cousin's children
    //removing that layer would allow the uncle's tree to take up less space, which could push the selected node closer to center
    const nodesToShow = getTreeSection(focusedIndex === -1 ? rootIndex : focusedIndex , 2, 4, tree);

    const nodeElements = [];
    if(nodes.length > 0){
        //if top node is not root it needs a line up
        let leftChild = true;
        let parentIndex = -1;
        if(nodesToShow[0] !== rootIndex){
            let topNode = nodes[nodesToShow[0]];
            let firstParent = nodes[topNode.parent];
            parentIndex = firstParent.index;
            //should also add node indicating how many things are up there
            if(firstParent.left == topNode.index){
                nodeElements.push(<LineBetween key={firstParent.id+"-toLeft"} fromPoint={{x:centerX, y:topY+changeY-10}} toPoint={{x:centerX+(changeX/2), y:20}}/>);
            }
            else{
                leftChild = false;
                nodeElements.push(<LineBetween key={firstParent.id+"-toRight"} fromPoint={{x:centerX, y:topY+changeY-10}} toPoint={{x:centerX-(changeX/2), y:20}}/>);
            }
        }

        //right now hardcode a center at 430, 300
        addRenderNodes(nodesToShow[0], centerX-changeX, topY, changeX, changeY, onNodeClicked, 4, nodeElements, nodes, focusedIndex, leftChild, parentIndex);
    }
  
    return <div >
            {nodeElements}
        </div>
}

function getActiveHistoryStep(tree){
    const activeAction = tree.history[tree.currentHistoryAction];
    if(!activeAction) return null;
    const activeStep = activeAction.steps[tree.currentHistoryStep];
    return activeStep;

}

function getDisplaySection(focusedIndex, nodes, rootIndex){
    let focusedNode = nodes[focusedIndex];
    if(focusedIndex === rootIndex){
        //levelsAbove = 0;
        let top = getChildrenBelow(focusedIndex, 1, 0, 4, nodes);
        return top;
    } else if(focusedNode.parent === rootIndex){
        //levelsAbove = 1;
        let parentNode = nodes[focusedIndex.parent];
        let focused = {index: focusedIndex, y:2, x:0, left:null, right:null};
        let top = {index: parentNode.index, y:1, x:0, left:null, right:null};
        if(parentNode.left === focusedIndex){
            top.x = .5;
            top.left = focused;
            top.right = getChildrenBelow(parentNode.right, 2, .25, 2, nodes);
        } else{
            top.x = -.5;
            top.right = focused;
            top.left = getChildrenBelow(parentNode.left, 2, -.25, 2, nodes);
        }
        return top;
    } else{
        //levelsAbove = 2;
        let focused = {index: focusedIndex, y:3, x:0, left:null, right:null};
        let parentNode = nodes[focusedIndex.parent];
        let focusedParent = {index: parentNode.index, y:2, x:0, left:null, right:null};
        if(parentNode.left === focusedIndex){
            focusedParent.x = .25;
            focusedParent.left = focused;
            focusedParent.right = getChildrenBelow(parentNode.right, 3, .5, 2, nodes);
        } else{
            focusedParent.x = -.25;
            focusedParent.right = focused;
            focusedParent.left = getChildrenBelow(parentNode.left, 3, -.5, 2, nodes);
        }
        let topNode = nodes[parentNode.parent];
        let top = {index: topNode.index, y:1, x:0, left:null, right:null};
        if(topNode.left === parentNode.index){
            top.x = focusedParent.x + .5;
            top.left = focusedParent;
            top.right = getChildrenBelow(topNode.right, 2, top.x + .125, 2, nodes);
        } else{
            top.x = focusedParent.x - .5;
            top.right = focusedParent;
            top.left = getChildrenBelow(topNode.left, 2, top.x - .125, 2, nodes);
        }
    }
}

function getChildrenBelow(index, currentY, currentX, moreLevels, nodes){
    if(index === -1) return null;
    const node = nodes[index];
    const value = {index: index, y:currentY, x:currentX, left:null, right:null};
    if(moreLevels == 0){
        value.out = true;
        return value;
    }
    const xDiff = Math.pow(2,moreLevels-1)*0.0625;//3=.5 2=.25 1=.125
    if(node.left !== -1){
        value.left = getChildrenBelow(node.left, currentY+1, currentX-xDiff,moreLevels-1,nodes);
    }
    if(node.right !== -1){
        value.right = getChildrenBelow(node.right, currentY+1, currentX+xDiff,moreLevels-1,nodes);
    }

    return value;

}

function addRenderNodes(baseIndex, previousX, previousY, changeX, changeY, onNodeClicked, depth, elements, nodes, selectedNode, leftChild, parentId){
    let baseNode = nodes[baseIndex];
    const newX = previousX + changeX;
    const newY = previousY + changeY;
    if(!baseNode){
        elements.push(<RedBlackNodeElement key={`${leftChild}-${parentId}`} x={newX} y={newY} originX={previousX} originY={previousY} value={""} isSmall/>);//need better key, for that need to know parent and if left or right null child
        return;
    }
    if(depth <= 0) {
        elements.push(<ExteriorNodeElement key={baseNode.id} x={newX} y={newY} originX={previousX} originY={previousY} childCount={baseNode.childCount+1} depth={baseNode.depthBelow+1} onClick={() => onNodeClicked(baseIndex)} />)
        //baseNode.childCount;
        //baseNode.depthBelow;
        return;
    }
    elements.push(<RedBlackNodeElement key={baseNode.id} onClick={() => onNodeClicked(baseIndex)} x={newX} y={newY} value={baseNode.value} isRed={baseNode.isRed} selected={baseIndex === selectedNode}/>);
    let leftChangeX = -Math.abs(changeX/2);
    let rightChangeX = Math.abs(changeX/2);
    elements.push(<LineBetween key={baseNode.id+"-toleft"} toPoint={{x:newX+leftChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    elements.push(<LineBetween key={baseNode.id+"-toright"} toPoint={{x:newX+rightChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    addRenderNodes(baseNode.left, newX, newY, leftChangeX, changeY, onNodeClicked, depth-1, elements, nodes, selectedNode, true, baseNode.id);
    addRenderNodes(baseNode.right, newX, newY, rightChangeX, changeY, onNodeClicked, depth-1, elements, nodes, selectedNode, false, baseNode.id);

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