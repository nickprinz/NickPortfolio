export function add(value, tree) {
    const newNode = makeNewNode(value);
    addNodeToArray(newNode, tree);
    if(tree.rootIndex === -1)
    {
        tree.rootIndex = newNode.index;
        newNode.depth = 1
        newNode.childCount = 0;
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

function removeSingleNode(removeNode, tree){
    if(removeNode.left === -1 && removeNode.right === -1){
        updateParentChildRelationship(removeNode.parent, removeNode, null, tree);
    } else if(removeNode.left === -1){
        updateParentChildRelationship(removeNode.parent, removeNode, tree.nodes[removeNode.right], tree);
    } else if(removeNode.right === -1){
        updateParentChildRelationship(removeNode.parent, removeNode, tree.nodes[removeNode.left], tree);
    }
    else{
        //both children exist, need to find leftmost child in right tree
        let swapChild = findMin(tree.nodes[removeNode.right], tree);
        swapNodesInTree(removeNode, swapChild, tree);
        removeSingleNode(swapChild, tree);
        return;
    }

    removeNodeFromArray(removeNode, tree);
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
    }

    newNode.index = tree.nodes.length;
    tree.nodes.push(newNode);
}

function removeNodeFromArray(removingNode, tree){
    tree.freeIndexes.push(removingNode.index);
    tree.nodes[removingNode.index] = null;
}

function updateChildCounts(parent, amount, tree){
    while(parent !== null){
        parent.childCount += amount;
        parent = parent.parent === -1 ? null : tree.nodes[parent.parent];
    }
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
    updateChildCounts(parentNode, 1, tree)
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
        left: -1,
        right: -1,
        parent: -1,
        index: -1,
    }
}
