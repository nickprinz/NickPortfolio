export function add(value, tree) {
    const newNode = makeNewNode(value);
    addNodeToArray(newNode, tree);
    if(tree.rootIndex === -1)
    {
        tree.rootIndex = newNode.index;
        newNode.isRed = false;
        return;
    }
    newNode.isRed = true;
    const addParent = findAddParent(newNode, tree);//will need to add these checks to the history
    addToParent(newNode, addParent, tree);
    //will need to balance to turn this from bst to rbt
}

export function remove(value, tree) {
    let removeNode = findFirstNode(value, tree);
    if(!removeNode){
        throw new Error(`could not find node ${value} in tree`)
    }
    removeSingleNode(removeNode, tree)
}

export function removeIndex(index, tree) {
    if(index < 0 || index >= tree.nodes.length || tree.nodes[index] === null){
        throw new Error(`could not find index ${index} in tree`)
    }
    removeSingleNode(tree.nodes[index], tree)
}

export function getTreeSection(rootIndex, count, tree){
    //for now, just stop at nodes within range, will eventually want a more count wherever there is extra stuff
    //if count is less than 3, still get 2 children, self, and parent
    //after fulfilling count, the parent and 2 children will be added to a queue
    //those nodes will get their relationship and add those to a queue, making a breadth first discovery
    //nulls that are not parents will be returned but not added to discovery queue
    
    //how do I structure this for easy access on the ui?
    //could just give a list of ids starting with the root id
    //also attach total found depth and widest depth to make drawing easier
    const amount = Math.max(4, count);




}

function removeSingleNode(removeNode, tree){
    const parentIndex = removeNode.parent;
    if(removeNode.left === -1 && removeNode.right === -1){
        updateParentChildRelationship(parentIndex, removeNode, null, tree);
    } else if(removeNode.left === -1){
        updateParentChildRelationship(parentIndex, removeNode, tree.nodes[removeNode.right], tree);
    } else if(removeNode.right === -1){
        updateParentChildRelationship(parentIndex, removeNode, tree.nodes[removeNode.left], tree);
    }
    else{
        //both children exist, need to find leftmost child in right tree
        let swapChild = findMin(tree.nodes[removeNode.right], tree);
        swapNodesInTree(removeNode, swapChild, tree);
        removeSingleNode(swapChild, tree);
        return;
    }
    adjustChildCount(parentIndex, -1, tree)
    removeNodeFromArray(removeNode, tree);
}

function adjustChildCount(parentIndex, changeAmount, tree){
    while(parentIndex !== -1){
        const parentNode = tree.nodes[parentIndex];
        parentNode.childCount += changeAmount;
        parentNode.depthBelow = getHighestDepth(parentNode.left, parentNode.right, tree) + 1;
        parentIndex = parentNode.parent;
    }
}

function getHighestDepth(index1, index2, tree){
    const n1 = tree.nodes[index1];
    const n2 = tree.nodes[index2];
    return Math.max(n1 ? n1.depthBelow : -1, n2 ? n2.depthBelow : -1)

}

function findAddParent(node, tree){
    let potentialParent = tree.nodes[tree.rootIndex];
    while(potentialParent !== null){
        if(node.value <= potentialParent.value){
            if(potentialParent.left === -1) {
                return potentialParent
            };
            potentialParent = tree.nodes[potentialParent.left];
        }
        else{
            if(potentialParent.right === -1) {
                return potentialParent
            };
            potentialParent = tree.nodes[potentialParent.right];
        }
    }

    throw new Error(`somehow tree could not find a parent node for ${node.value}`);
}

function addNodeToArray(newNode, tree){
    if(tree.freeIndexes.length > 0){
        newNode.index = tree.freeIndexes.pop();
        tree.nodes[newNode.index] = newNode;
        return;
    }

    newNode.index = tree.nodes.length;
    tree.nodes.push(newNode);
}

function removeNodeFromArray(removingNode, tree){
    tree.freeIndexes.push(removingNode.index);
    tree.nodes[removingNode.index] = null;
}

function findFirstNode(value, tree){
    let possibleNode = tree.nodes[tree.rootIndex];
    while(possibleNode){
        if(value === possibleNode.value){
            return possibleNode;
        }
        if(value <= possibleNode.value){
            possibleNode = tree.nodes[possibleNode.left];
        }
        else{
            possibleNode = tree.nodes[possibleNode.right];
        }
    }
    return null;
}

function updateParentChildRelationship(parentIndex, childNode, newChildNode, tree){
    if(parentIndex === -1){
        if(newChildNode === null){
            tree.rootIndex = -1;
            return;
        }
        tree.rootIndex = newChildNode.index;
        if(newChildNode) newChildNode.parent = -1;
        return;
    }

    let parentNode = tree.nodes[parentIndex];
    let newChildIndex = newChildNode ? newChildNode.index : -1;
    if(parentNode.left === childNode.index){
        childNode.parent = -1;
        parentNode.left = newChildIndex;
    } else if(parentNode.right === childNode.index){
        childNode.parent = -1;
        parentNode.right = newChildIndex;
    }else{
        throw new Error(`no parent child relationship from ${parentNode.index} to ${childNode.index}`);
    }
    
    //will need to update depths and amounts
    if(newChildNode) newChildNode.parent = parentNode.index;

}

function addToParent(newNode, parentNode, tree){
    newNode.parent = parentNode.index;
    newNode.depth = parentNode.depth+1;//might also want a below depth
    if(newNode.value <= parentNode.value){
        if(parentNode.left !== -1) throw new Error(`tried to add left child in occupied spot p:${parentNode.index}`)
        parentNode.left = newNode.index;
    }
    else{
        if(parentNode.right !== -1) throw new Error(`tried to add right child in occupied spot p:${parentNode.index}`)
        parentNode.right = newNode.index;
    }
    adjustChildCount(parentNode.index, 1, tree);
}

function findMin(startNode, tree){
    let node = startNode;
    while(node.left >= 0){
        node = tree.nodes[node.left];
    }
    return node;
}

function swapNodesInTree(node1, node2){
    //for now this just swaps the values in the object at each index
    let tempVal1 = node1.value;
    node1.value = node2.value;
    node2.value = tempVal1;
}

function makeNewNode(v){
    return {
        value: v,
        isRed: false,
        childCount: 0,
        depth: 1,
        depthBelow: 0,
        left: -1,
        right: -1,
        parent: -1,
        index: -1,
    }
}
