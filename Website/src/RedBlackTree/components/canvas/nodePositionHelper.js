export class CanvasPositioner{
    #centerX = 0;
    #xUnit = 0;
    #yUnit = 0;
    constructor(width, height){
        this.#centerX = width/2;
        this.#xUnit = this.#centerX - 20;
        this.#yUnit = height/7;
    }

    toCanvasSpace = ({x,y}) => {
        let cx = this.#centerX + (this.#xUnit*x);
        let cy = this.#yUnit * y;
        return {x: cx, y: cy};
    }

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