//need to change this to return an array that will include out nodes
//each node will have its lines defined as an array in those nodes
//currently each item is index: parentNode.index, y:1, x:0, left:makeNull(), right:makeNull()
//need it to be {index, id, x, y, value, isRed, isOut, depth, childCount, linesTo[]}
//lines are {x, y}, will get id and frompos from its parent structure
//those should probably be classes

class NodePositioner{

    constructor(node, x, y, isOut){
        this.x = x;
        this.y = y;
        if(!node){
            this.value = null;
            this.index = null;
            this.id = null;
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

    addLineTo(x, y){
        this.linesTo.push({x:x,y:y});
    }
}

export function getDisplaySection2(focusedIndex, nodes, rootIndex){
    if(focusedIndex === -1) return [];
    let focusedNode = nodes[focusedIndex];
    if(focusedIndex === rootIndex){
        let positioners = getChildrenBelow2(focusedIndex, 1, 0, 4, nodes);
        return positioners;
    } else if(focusedNode.parent === rootIndex){
        return getDisplaySectionOneBelowRoot2(focusedNode, nodes);
    } else{
        return getDisplaySectionTwoOrMoreBelowRoot2(focusedNode, nodes);
    }
}

function getDisplaySectionOneBelowRoot2(focusedNode, nodes){
    const parentNode = nodes[focusedNode.parent];
    const isLeftChild = parentNode.left === focusedNode.index;
    let positioners = getChildrenBelow2(focusedNode.index, 2, isLeftChild ? -.15 : .15, 3, nodes);
    const focused = positioners[0];
    const top = new NodePositioner(parentNode, 0, 1);
    top.addLineTo(focused.x,focused.y);
    let otherChildNodes = [];
    if(isLeftChild){
        top.x = focused.x + .5;
        otherChildNodes = getChildrenBelow2(parentNode.right, 2, top.x + .25, 2, nodes);
    } else{
        top.x = focused.x + -.5;
        otherChildNodes = getChildrenBelow2(parentNode.left, 2, top.x - .25, 2, nodes);
    }
    top.addLineTo(otherChildNodes[0].x, otherChildNodes[0].y);
    positioners = [top, ...positioners, ...otherChildNodes];
    return positioners;
}

function getDisplaySectionTwoOrMoreBelowRoot2(focusedNode, nodes){
    let parentNode = nodes[focusedNode.parent];
    let isLeftChild = parentNode.left === focusedNode.index;
    let topNode = nodes[parentNode.parent];
    let isParentLeftChild = topNode.left === parentNode.index;
    let focusedX = isParentLeftChild ? -.2 : .2;
    focusedX += isLeftChild ? -.1 : .1;
    //cna change to getChildrenBelow2 for parentNode to minimize the chunk below until top is made
    let positioners = getChildrenBelow2(focusedNode.index, 3, focusedX, 2, nodes);
    let focused = positioners[0];
    const focusedParent = new NodePositioner(parentNode, 0, 2);
    focusedParent.addLineTo(focused.x,focused.y);
    let otherChildNodes = [];
    if(isLeftChild){
        focusedParent.x = focused.x + .25;
        otherChildNodes = getChildrenBelow2(parentNode.right, 3, focused.x + .5, 2, nodes);
    } else{
        focusedParent.x = focused.x + -.25;
        otherChildNodes = getChildrenBelow2(parentNode.left, 3, focused.x - .5, 2, nodes);
    }
    focusedParent.addLineTo(otherChildNodes[0].x, otherChildNodes[0].y);

    let top = new NodePositioner(topNode, 0, 1);
    top.addLineTo(focusedParent.x,focusedParent.y);
    let topOtherChildNodes = [];
    if(isParentLeftChild){
        top.x = focusedParent.x + .45;
        topOtherChildNodes = getChildrenBelow2(topNode.right, 2, top.x + .32, 2, nodes);
    } else{
        top.x = focusedParent.x - .45;
        topOtherChildNodes = getChildrenBelow2(topNode.left, 2, top.x - .32, 2, nodes);
    }
    top.addLineTo(topOtherChildNodes[0].x, topOtherChildNodes[0].y);
    return [top, focusedParent, ...positioners, ...otherChildNodes, ...topOtherChildNodes];
}

function getChildrenBelow2(index, currentY, currentX, moreLevels, nodes){
    if(index === -1) return [new NodePositioner(null, currentX, currentY)];
    const node = nodes[index];
    const xDiff = Math.pow(2,moreLevels-1)*0.0625;//3=.5 2=.25 1=.125
    const value = new NodePositioner(node, currentX, currentY, moreLevels === 0);
    if(value.isOut){
        return [value];
    }
    const leftX = currentX-xDiff;
    const rightX = currentX+xDiff;
    const nextY = currentY+1;
    value.addLineTo(leftX, nextY);
    value.addLineTo(rightX, nextY);
    const childValues = [];
    childValues.push(...getChildrenBelow2(node.left, nextY, leftX,moreLevels-1,nodes));
    childValues.push(...getChildrenBelow2(node.right, nextY, rightX,moreLevels-1,nodes));

    return [value, ...childValues];
}

export function getDisplaySection(focusedIndex, nodes, rootIndex){
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
