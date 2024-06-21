export default class BinarySearchTree{

    static add(value, tree) {
        const actionHistory = this._makeActionHistory(`Add ${value}`);
        this._performAdd(value, tree, actionHistory);
        tree.history.push(actionHistory);
    }

    static remove(value, tree) {
        let removeNode = this._findFirstNode(value, tree);
        if(!removeNode){
            throw new Error(`could not find node ${value} in tree`)
        }
        this._removeSingleNode(removeNode, tree);
    }
    
    static removeIndex(index, tree) {
        if(index < 0 || index >= tree.nodes.length || tree.nodes[index] === null){
            throw new Error(`could not find index ${index} in tree`)
        }
        this._removeSingleNode(tree.nodes[index], tree);
    }
    
    static getTreeSection(initialIndex, levelsUp, totalLevels, nodes){
        if(nodes.length === 0) return [];
        let topIndex = this._getIndexUpTree(initialIndex, levelsUp, nodes);
        return this._getNodeIndexesDown(topIndex, totalLevels, nodes);
    }

    static getClosestReplacement(removeIndex, nodes){
        let removeNode = nodes[removeIndex];
        if(removeNode.left === -1 && removeNode.right === -1) {
            if(removeNode.parent === -1) return -1;
            return removeNode.parent;
        }
        if(removeNode.left === -1) return removeNode.right;
        if(removeNode.right === -1) return removeNode.left;
        return removeIndex;
    }

    static _performAdd(value, tree, actionHistory){
        const newNode = this._makeNewNode(value);
        this._addNodeToArray(newNode, tree);
        if(tree.rootIndex === -1)
        {
            tree.rootIndex = newNode.index;
            this._addHistoryRecordChange(actionHistory,newNode.index,"parent",-1);
            return newNode;
        }
        const addParent = this._findAddParent(newNode, tree);//will need to add these checks to the history
        this._addToParent(newNode, addParent, tree);
        return newNode;
    }

    static _findAddParent(node, tree){
        let potentialParent = tree.nodes[tree.rootIndex];
        while(potentialParent !== null){
            if(node.value <= potentialParent.value){
                if(potentialParent.left === -1) {
                    return potentialParent;
                };
                potentialParent = tree.nodes[potentialParent.left];
            }
            else{
                if(potentialParent.right === -1) {
                    return potentialParent;
                };
                potentialParent = tree.nodes[potentialParent.right];
            }
        }
    
        throw new Error(`somehow tree could not find a parent node for ${node.value}`);
    }

    static _getIndexUpTree(startIndex, levelsUp, nodes){
        let currentIndex = startIndex;
        for (let index = 0; index < levelsUp; index++) {
            const node = nodes[currentIndex];
            if(!node) return -1;
            if(node.parent === -1) return currentIndex;
            currentIndex = node.parent;
        }
        return currentIndex;
    }

    static _getNodeIndexesDown(startIndex, levelsDown, nodes){
        let result = [startIndex];
        if(levelsDown == 0) return result;
        let currentNode = nodes[startIndex];
        if(!currentNode) return result;
        if(currentNode.left !== -1){
            result = [...result, ...this._getNodeIndexesDown(currentNode.left, levelsDown-1, nodes)];
        }
        if(currentNode.right !== -1){
            result = [...result, ...this._getNodeIndexesDown(currentNode.right, levelsDown-1, nodes)];
        }
        return result;
    }

    static _addNodeToArray(newNode, tree){
        if(tree.freeIndexes.length > 0){
            newNode.index = tree.freeIndexes.pop();
            tree.nodes[newNode.index] = newNode;
        }
        else{
            newNode.index = tree.nodes.length;
            tree.nodes.push(newNode);
        }
    
        newNode.id = this._generateId(newNode.value, newNode.index, tree.nodes.length);
    }

    static _removeSingleNode(removeNode, tree){
        if(removeNode.left !== -1 && removeNode.right !== -1){
            //both children exist, need to find leftmost child in right tree
            let swapChild = this._findMin(tree.nodes[removeNode.right], tree.nodes);
            this._swapNodesInTree(removeNode, swapChild, tree);
            this._removeSingleNode(swapChild, tree);
            return undefined;
        }

        const parentIndex = removeNode.parent;
        let replacedChild = null;
        if(removeNode.right !== -1){
            replacedChild = tree.nodes[removeNode.right];
        } else if(removeNode.left !== -1){
            replacedChild = tree.nodes[removeNode.left];
        }
        this._swapChildRelationship(parentIndex, removeNode, replacedChild, tree);

        this._adjustChildCount(parentIndex, -1, tree)
        this._removeNodeFromArray(removeNode, tree);
        return replacedChild;
    }
    
    static _removeNodeFromArray(removingNode, tree){
        tree.freeIndexes.push(removingNode.index);
        tree.nodes[removingNode.index] = null;
    }

    static _findMin(startNode, nodes){
        let node = startNode;
        while(node.left >= 0){
            node = nodes[node.left];
        }
        return node;
    }
    
    static _findFirstNode(value, tree){
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

    static _swapNodesInTree(node1, node2){
        //for now this just swaps the values in the object at each index
        let tempVal1 = node1.value;
        let tempId1 = node1.id;
        node1.value = node2.value;
        node1.id = node2.id;
        node2.value = tempVal1;
        node2.id = tempId1;
    }

    static _swapChildRelationship(parentIndex, childNode, newChildNode, tree){
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
        
        if(newChildNode) newChildNode.parent = parentNode.index;
    }

    static _generateId(value, index, nodeCount){
        //need to provide a unique but also stable id on creation
        //value+nodeCount+index when created maybe
        //this isn't perfect, but an least isolated problem
        return `${value}-${index}-${nodeCount}`;
    }

    static _makeNewNode(v){
        return {
            value: v,
            id:"not yet",
            left: -1,
            right: -1,
            parent: -1,
            index: -1,
            childCount: 0,
            depthBelow: 0,
        };
    }

    static _makeActionHistory(name){
        return {
            name: name,
            records: [],
        }
    }

    static _addHistoryRecordChange(actionHistory, nodeIndex, attributeName, attributeValue){
        actionHistory.records.push({
            type:"change",
            index:nodeIndex,
            attribute:attributeName,
            value:attributeValue,
        })
    }
    
    static _addHistoryRecordCompare(actionHistory, primaryNodeIndex, SecondaryNodeIndex){
        actionHistory.records.push({
            type:"compare",
            primaryIndex:primaryNodeIndex,
            secondaryIndex:SecondaryNodeIndex,
        })
    }

    static _addToParent(newNode, parentNode, tree){
        newNode.parent = parentNode.index;
        if(newNode.value <= parentNode.value){
            if(parentNode.left !== -1) throw new Error(`tried to add left child in occupied spot p:${parentNode.index}`)
            parentNode.left = newNode.index;
        }
        else{
            if(parentNode.right !== -1) throw new Error(`tried to add right child in occupied spot p:${parentNode.index}`)
            parentNode.right = newNode.index;
        }
        this._adjustChildCount(parentNode.index, 1, tree);
    }

    static _adjustChildCount(parentIndex, changeAmount, tree){
        while(parentIndex !== -1){
            const parentNode = tree.nodes[parentIndex];
            parentNode.childCount += changeAmount;
            this._recalculateDepthBelow(parentNode, tree.nodes);
            parentIndex = parentNode.parent;
        }
    }
    
    static _recalculateDepthBelow(node, nodes){
        node.depthBelow = this._getHighestDepth(node.left, node.right, nodes) + 1;
    }
    
    static _getHighestDepth(index1, index2, nodes){
        const n1 = nodes[index1];
        const n2 = nodes[index2];
        return Math.max(n1 ? n1.depthBelow : -1, n2 ? n2.depthBelow : -1)
    }
    

    static _getSibling(nodeIndex, nodes){
        if(nodeIndex === -1) return null;
        const node = nodes[nodeIndex];
        if(node.parent === -1) return null;
        const parent = nodes[node.parent];
        if(parent.left === nodeIndex){
            return nodes[parent.right];
        }
        return nodes[parent.left];
    }

    static _getOtherChild(parentIndex, firstChildIndex, nodes){
        const parent = nodes[parentIndex];
        if(parent.left === firstChildIndex){
            return nodes[parent.right];
        }
        return nodes[parent.left];
    }

    static _recalculateChildCount(node, nodes){
        let childCount = 0;
        if(node.left !== -1){
            childCount += nodes[node.left].childCount + 1;
        }
        if(node.right !== -1){
            childCount += nodes[node.right].childCount + 1;
        }
    
        node.childCount = childCount;
    }
}