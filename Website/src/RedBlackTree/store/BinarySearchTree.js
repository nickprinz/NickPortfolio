const historyCount = 10;

export default class BinarySearchTree{
    //add a keepHistory flag to the constructor
    #keepHistory = true;
    constructor(tree, keepHistory=true){
        this._tree = tree;
        this.#keepHistory = keepHistory;
    }

    add(value) {
        this._makeActionHistory(`Add ${value}`);
        this._performAdd(value);
    }

    remove(value) {
        let removeNode = this._findFirstNode(value);
        if(!removeNode){
            throw new Error(`could not find node ${value} in tree`)
        }
        this._removeSingleNode(removeNode);
    }
    
    removeIndex(index) {
        if(index < 0 || index >= this._tree.nodes.length || this._tree.nodes[index] === null){
            throw new Error(`could not find index ${index} in tree`)
        }
        this._removeSingleNode(this._tree.nodes[index]);
    }
    
    getTreeSection(initialIndex, levelsUp, totalLevels){
        if(this._tree.nodes.length === 0) return [];
        let topIndex = this._getIndexUpTree(initialIndex, levelsUp);
        return this._getNodeIndexesDown(topIndex, totalLevels);
    }

    getClosestReplacement(removeIndex){
        let removeNode = this._tree.nodes[removeIndex];
        if(removeNode.left === -1 && removeNode.right === -1) {
            if(removeNode.parent === -1) return -1;
            return removeNode.parent;
        }
        if(removeNode.left === -1) return removeNode.right;
        if(removeNode.right === -1) return removeNode.left;
        return removeIndex;
    }

    _performAdd(value){
        const newNode = this._makeNewNode(value);
        this._addNodeToArray(newNode);
        if(this._tree.rootIndex === -1)
        {
            this._tree.rootIndex = newNode.index;
            this._addHistoryRecordChange(newNode.index,"parent",-1);
            return newNode;
        }
        const addParent = this._findAddParent(newNode);
        this._addToParent(newNode, addParent);
        return newNode;
    }

    _findAddParent(node){
        let potentialParent = this._tree.nodes[this._tree.rootIndex];
        while(potentialParent !== null){
            this._addHistoryRecordCompare(node.index, potentialParent.index);
            if(node.value <= potentialParent.value){
                if(potentialParent.left === -1) {
                    return potentialParent;
                };
                potentialParent = this._tree.nodes[potentialParent.left];
            }
            else{
                if(potentialParent.right === -1) {
                    return potentialParent;
                };
                potentialParent = this._tree.nodes[potentialParent.right];
            }
        }
    
        throw new Error(`somehow tree could not find a parent node for ${node.value}`);
    }

    _getIndexUpTree(startIndex, levelsUp){
        let currentIndex = startIndex;
        for (let index = 0; index < levelsUp; index++) {
            const node = this._tree.nodes[currentIndex];
            if(!node) return -1;
            if(node.parent === -1) return currentIndex;
            currentIndex = node.parent;
        }
        return currentIndex;
    }

    _getNodeIndexesDown(startIndex, levelsDown){
        let result = [startIndex];
        if(levelsDown == 0) return result;
        let currentNode = this._tree.nodes[startIndex];
        if(!currentNode) return result;
        if(currentNode.left !== -1){
            result = [...result, ...this._getNodeIndexesDown(currentNode.left, levelsDown-1)];
        }
        if(currentNode.right !== -1){
            result = [...result, ...this._getNodeIndexesDown(currentNode.right, levelsDown-1)];
        }
        return result;
    }

    _addNodeToArray(newNode){
        if(this._tree.freeIndexes.length > 0){
            newNode.index = this._tree.freeIndexes.pop();
            this._tree.nodes[newNode.index] = newNode;
        }
        else{
            newNode.index = this._tree.nodes.length;
            this._tree.nodes.push(newNode);
        }
    
        newNode.id = this.#generateId();
    }

    _removeSingleNode(removeNode){
        if(removeNode.left !== -1 && removeNode.right !== -1){
            //both children exist, need to find leftmost child in right tree
            let swapChild = this._findMin(this._tree.nodes[removeNode.right], this._tree.nodes);
            this._swapNodesInTree(removeNode, swapChild);
            this._removeSingleNode(swapChild);
            return undefined;
        }

        const parentIndex = removeNode.parent;
        let replacedChild = null;
        if(removeNode.right !== -1){
            replacedChild = this._tree.nodes[removeNode.right];
        } else if(removeNode.left !== -1){
            replacedChild = this._tree.nodes[removeNode.left];
        }
        this._swapChildRelationship(parentIndex, removeNode, replacedChild, this._tree);

        this._adjustChildCount(parentIndex, -1, this._tree)
        this._removeNodeFromArray(removeNode, this._tree);
        return replacedChild;
    }
    
    _removeNodeFromArray(removingNode){
        this._tree.freeIndexes.push(removingNode.index);
        this._tree.nodes[removingNode.index] = null;
    }

    _findMin(startNode){
        let node = startNode;
        while(node.left >= 0){
            node = this._tree.nodes[node.left];
        }
        return node;
    }
    
    _findFirstNode(value){
        let possibleNode = this._tree.nodes[this._tree.rootIndex];
        while(possibleNode){
            if(value === possibleNode.value){
                return possibleNode;
            }
            if(value <= possibleNode.value){
                possibleNode = this._tree.nodes[possibleNode.left];
            }
            else{
                possibleNode = this._tree.nodes[possibleNode.right];
            }
        }
        return null;
    }

    _swapNodesInTree(node1, node2){
        //for now this just swaps the values in the object at each index
        let tempVal1 = node1.value;
        let tempId1 = node1.id;
        node1.value = node2.value;
        node1.id = node2.id;
        node2.value = tempVal1;
        node2.id = tempId1;
    }

    _swapChildRelationship(parentIndex, childNode, newChildNode){
        if(parentIndex === -1){
            if(newChildNode === null){
                this._tree.rootIndex = -1;
                return;
            }
            this._tree.rootIndex = newChildNode.index;
            if(newChildNode) newChildNode.parent = -1;
            return;
        }

        let parentNode = this._tree.nodes[parentIndex];
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

    #generateId(){
        this._tree.nextId++;
        return this._tree.nextId;
    }

    _makeNewNode(v){
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

    _makeActionHistory(name){
        if(this.#keepHistory){
            this._tree.history.splice(0,0,{
                id: this._tree.nextHistoryId,
                name: name,
                records: [],
            });
            this._tree.nextHistoryId++;
            if(this._tree.history.length > historyCount){
                this._tree.history = this._tree.history.slice(0,historyCount);
            }
        }
    }

    _addHistoryRecordChange(nodeIndex, attributeName, attributeValue){
        if(this.#keepHistory){
            const actionHistory = this.#getCurrentHistory();
            actionHistory.records.push({
                type:"change",
                index:nodeIndex,
                attribute:attributeName,
                value:attributeValue,
            })
        }
    }
    
    _addHistoryRecordCompare(primaryNodeIndex, SecondaryNodeIndex){
        if(this.#keepHistory){
            const actionHistory = this.#getCurrentHistory();
            actionHistory.records.push({
                type:"compare",
                primaryIndex:primaryNodeIndex,
                secondaryIndex:SecondaryNodeIndex,
            })
        }
    }
    
    _addHistoryRecordNote(nodeIndex, note){
        if(this.#keepHistory){
            const actionHistory = this.#getCurrentHistory();
            actionHistory.records.push({
                type:"note",
                index:nodeIndex,
                note:note,
            })
        }
    }

    #getCurrentHistory(){
        return this._tree.history[this._tree.history.length-1];
    }

    _addToParent(newNode, parentNode){
        newNode.parent = parentNode.index;
        if(newNode.value <= parentNode.value){
            if(parentNode.left !== -1) throw new Error(`tried to add left child in occupied spot p:${parentNode.index}`)
            parentNode.left = newNode.index;
        }
        else{
            if(parentNode.right !== -1) throw new Error(`tried to add right child in occupied spot p:${parentNode.index}`)
            parentNode.right = newNode.index;
        }
        this._addHistoryRecordChange(newNode.index,"parent",parentNode.index);
        this._adjustChildCount(parentNode.index, 1);
    }

    _adjustChildCount(parentIndex, changeAmount){
        while(parentIndex !== -1){
            const parentNode = this._tree.nodes[parentIndex];
            parentNode.childCount += changeAmount;
            this._recalculateDepthBelow(parentNode, this._tree.nodes);
            parentIndex = parentNode.parent;
        }
    }
    
    _recalculateDepthBelow(node){
        node.depthBelow = this._getHighestDepth(node.left, node.right) + 1;
    }
    
    _getHighestDepth(index1, index2){
        const n1 = this._tree.nodes[index1];
        const n2 = this._tree.nodes[index2];
        return Math.max(n1 ? n1.depthBelow : -1, n2 ? n2.depthBelow : -1)
    }
    

    _getSibling(nodeIndex){
        if(nodeIndex === -1) return null;
        const node = this._tree.nodes[nodeIndex];
        if(node.parent === -1) return null;
        const parent = this._tree.nodes[node.parent];
        if(parent.left === nodeIndex){
            return this._tree.nodes[parent.right];
        }
        return this._tree.nodes[parent.left];
    }

    _getOtherChild(parentIndex, firstChildIndex){
        const parent = this._tree.nodes[parentIndex];
        if(parent.left === firstChildIndex){
            return this._tree.nodes[parent.right];
        }
        return this._tree.nodes[parent.left];
    }

    _recalculateChildCount(node){
        let childCount = 0;
        if(node.left !== -1){
            childCount += this._tree.nodes[node.left].childCount + 1;
        }
        if(node.right !== -1){
            childCount += this._tree.nodes[node.right].childCount + 1;
        }
    
        node.childCount = childCount;
    }
}