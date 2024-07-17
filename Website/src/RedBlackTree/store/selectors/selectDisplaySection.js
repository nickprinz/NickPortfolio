//need to change this to return an array that will include out nodes
//each node will have its lines defined as an array in those nodes
//currently each item is index: parentNode.index, y:1, x:0, left:makeNull(), right:makeNull()
//need it to be {index, id, x, y, value, isRed, isOut, depth, childCount, linesTo[]}
//lines are {x, y}, will get id and frompos from its parent structure
//those should probably be classes

import BinarySearchTree from "../BinarySearchTree";

class BasePositioner{

    constructor(x, y, id){
        this.x = x;
        this.y = y;
        this.id = id;
    }

}

class NodePositioner extends BasePositioner{

    constructor(node, x, y, isOut, nullId){
        super(x, y, null);
        
        if(!node){
            this.value = null;
            this.index = null;
            this.id = nullId;
            return;
        }
        this.value = node.value;
        this.index = node.index;
        this.id = node.id;
        this.isOut = isOut;
        this.isRed = node.isRed;
        this.childCount = node.childCount+1;
        this.depthBelow = node.depthBelow+1;
        this.linesTo = [];
    }

    addLineTo(x, y, key){
        this.linesTo.push({x:x, y:y, key:key});
    }
}

class CompareNodePositioner extends BasePositioner{
    constructor(x, y, id, isGreater){
        super(x, y, id);
        this.isGreater = isGreater;
    }

}

export default function selectDisplaySection(focusedIndex, nodes, rootIndex, activeHistoryStep){
    if(!nodes[focusedIndex] || rootIndex === -1) return [];
    const section = getSection(focusedIndex, nodes, rootIndex);
    addStepPositioners(section, nodes, activeHistoryStep);
    return section;
}

function addStepPositioners(section, nodes, activeHistoryStep){
    if(!activeHistoryStep) return 
    if(activeHistoryStep.type === BinarySearchTree.COMPARE){
        const compareTo = section.find(x => x.index === activeHistoryStep.secondaryIndex);
        const stepNode = new NodePositioner(nodes[activeHistoryStep.primaryIndex],compareTo.x, compareTo.y);
        const isLess = stepNode.value <= compareTo.value;
        stepNode.x += (isLess ? -.25 : .25)
        section.push(stepNode);
        //find activeHistoryStep.secondaryIndex in section
        //put a node .2 to the left or right of that display
        //
    }
    if(activeHistoryStep.type === BinarySearchTree.CHANGE && activeHistoryStep.attribute === BinarySearchTree.PARENT){
        const compareTo = section.find(x => x.index === activeHistoryStep.value);
        if(compareTo){
            const stepNode = new NodePositioner(nodes[activeHistoryStep.index],compareTo.x, compareTo.y);
            const isLess = stepNode.value <= compareTo.value;
            stepNode.x += (isLess ? -.25 : .25)
            section.push(stepNode);

        }
        else{
            //need logic for removing from tree
        }

    }

}

function getSection(focusedIndex, nodes, rootIndex){
    if(focusedIndex === -1) return [];
    let focusedNode = nodes[focusedIndex];
    if(focusedIndex === rootIndex){
        let positioners = getChildrenBelow(focusedIndex, 1, 0, 4, nodes);
        return positioners;
    } else if(focusedNode.parent === rootIndex){
        return getDisplaySectionOneBelowRoot(focusedNode, nodes);
    } else{
        return getDisplaySectionTwoOrMoreBelowRoot(focusedNode, nodes);
    }
}

function getDisplaySectionOneBelowRoot(focusedNode, nodes){
    const parentNode = nodes[focusedNode.parent];
    const isLeftChild = parentNode.left === focusedNode.index;
    let positioners = getChildrenBelow(focusedNode.index, 2, isLeftChild ? -.15 : .15, 3, nodes);
    const focused = positioners[0];
    const top = new NodePositioner(parentNode, 0, 1);
    top.addLineTo(focused.x,focused.y, isLeftChild ? "left" : "right");
    let otherChildNodes = [];
    if(isLeftChild){
        top.x = focused.x + .5;
        otherChildNodes = getChildrenBelow(parentNode.right, 2, top.x + .25, 2, nodes, false, parentNode.id);
    } else{
        top.x = focused.x + -.5;
        otherChildNodes = getChildrenBelow(parentNode.left, 2, top.x - .25, 2, nodes, true, parentNode.id);
    }
    top.addLineTo(otherChildNodes[0].x, otherChildNodes[0].y, !isLeftChild ? "left" : "right");
    positioners = [top, ...positioners, ...otherChildNodes];
    return positioners;
}

function getDisplaySectionTwoOrMoreBelowRoot(focusedNode, nodes){
    let parentNode = nodes[focusedNode.parent];
    let isLeftChild = parentNode.left === focusedNode.index;
    let topNode = nodes[parentNode.parent];
    let isParentLeftChild = topNode.left === parentNode.index;
    let focusedX = isParentLeftChild ? -.2 : .2;
    focusedX += isLeftChild ? -.1 : .1;
    let parentX = isLeftChild ? focusedX + .25 : focusedX + -.25;
    
    let positioners = getChildrenBelow(parentNode.index, 2, parentX, 3, nodes);
    const focusedParent = positioners[0]

    let top = new NodePositioner(topNode, 0, 1);
    top.addLineTo(focusedParent.x,focusedParent.y, isParentLeftChild ? "left" : "right");
    let topOtherChildNodes = [];
    if(isParentLeftChild){
        top.x = focusedParent.x + .45;
        topOtherChildNodes = getChildrenBelow(topNode.right, 2, top.x + .32, 2, nodes, false, topNode.id);
    } else{
        top.x = focusedParent.x - .45;
        topOtherChildNodes = getChildrenBelow(topNode.left, 2, top.x - .32, 2, nodes, true, topNode.id);
    }
    top.addLineTo(topOtherChildNodes[0].x, topOtherChildNodes[0].y, !isParentLeftChild ? "left" : "right");
    const aboveTop = getAboveTop(top, nodes);
    return [top, ...positioners, ...topOtherChildNodes, ...aboveTop];
}

function getChildrenBelow(index, currentY, currentX, moreLevels, nodes, isLeftChild, parentId){
    if(index === -1) {
        const nullId = parentId + "-" + (isLeftChild ? "left" : "right") + "-null";
        return [new NodePositioner(null, currentX, currentY, false, nullId)]
    };
    const node = nodes[index];
    const xDiff = Math.pow(2,moreLevels-1)*0.0625;//3=.5 2=.25 1=.125
    const value = new NodePositioner(node, currentX, currentY, moreLevels === 0);
    if(value.isOut){
        return [value];
    }
    const leftX = currentX-xDiff;
    const rightX = currentX+xDiff;
    const nextY = currentY+1;
    value.addLineTo(leftX, nextY, "left");
    value.addLineTo(rightX, nextY, "right");
    const childValues = [];
    childValues.push(...getChildrenBelow(node.left, nextY, leftX, moreLevels-1, nodes, true, node.id));
    childValues.push(...getChildrenBelow(node.right, nextY, rightX, moreLevels-1, nodes, false, node.id));

    return [value, ...childValues];
}

function getAboveTop(childPositioner, nodes){
    //change x by .2 and y by .5
    const childNode = nodes[childPositioner.index];
    if(childNode.parent === -1) return [];
    const parentNode = nodes[childNode.parent];
    let isLeftChild = parentNode.left === childNode.index;
    const value = new NodePositioner(parentNode, childPositioner.x + (isLeftChild ? .2 : -.2), childPositioner.y - .5, true);
    value.addLineTo(childPositioner.x, childPositioner.y, isLeftChild ? "left" : "right");
    return [value];
}
