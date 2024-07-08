import TreeHistory from "./TreeHistory";

const historyCount = 10;

export default class BinarySearchTree{

    static PARENT = "parent";
    static CHANGE = "change";
    static COMPARE = "compare";
    static NOTE = "note";
    static ROOT = "root";

    static MakeInitialTree(){
        return {
            nodes: [],
            rootIndex: -1,
            freeIndexes: [],
            history: TreeHistory.MakeInitialHistory(),
            nextId: 0,
        };
    }

    constructor(tree, keepHistory=true){
        this._tree = tree;
        this._history = new TreeHistory(this._tree.history, (s) => this._undoHistoryStep(s), (s) => this._redoHistoryStep(s), keepHistory);
    }

    add(value) {
        this._history.moveHistoryToCurrent();
        this._makeActionHistory(`Add`, value);
        const addedNode = this._performAdd(value);
        return addedNode.index;
    }

    remove(value) {
        this._history.moveHistoryToCurrent();
        let removeNode = this._findFirstNode(value);
        if(!removeNode){
            throw new Error(`could not find node ${value} in tree`)
        }
        this._removeSingleNode(removeNode);
    }
    
    removeIndex(index) {
        this._history.moveHistoryToCurrent();
        if(index < 0 || index >= this._tree.nodes.length || this._tree.nodes[index] === null){
            throw new Error(`could not find index ${index} in tree`)
        }
        this._removeSingleNode(this._tree.nodes[index]);
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

    moveHistory(amount){
        this._history.moveHistory(amount);
    }

    moveHistoryToCurrent(){
        this._history.moveHistoryToCurrent();
    }

    moveHistoryToLast(){
        this._history.moveHistoryToLast();
    }

    setHistoryToPosition(actionIndex, stepIndex){
        this._history.setHistoryToPosition(actionIndex, stepIndex);
    }

    _undoHistoryStep(historyStep){
        if(historyStep.type !== BinarySearchTree.CHANGE) return;

        if(historyStep.attribute === BinarySearchTree.ROOT){
            this._tree.rootIndex = historyStep.oldValue;
            return;
        }

        if(historyStep.attribute === BinarySearchTree.PARENT){
            this._removeParentRelationship(historyStep.index, historyStep.value);
            this._addParentChildRelationship(historyStep.index, historyStep.oldValue);
            return;
        }

        const node = this._tree.nodes[historyStep.index];
        node[historyStep.attribute] = historyStep.oldValue;
    }

    _redoHistoryStep(historyStep){
        if(historyStep.type !== BinarySearchTree.CHANGE) return;

        if(historyStep.attribute === BinarySearchTree.ROOT){
            this._tree.rootIndex = historyStep.value;
            return;
        }

        if(historyStep.attribute === BinarySearchTree.PARENT){
            this._removeParentRelationship(historyStep.index, historyStep.oldValue);
            this._addParentChildRelationship(historyStep.index, historyStep.value);
            return;
        }
        const node = this._tree.nodes[historyStep.index];
        node[historyStep.attribute] = historyStep.value;
    }

    _performAdd(value){
        const newNode = this._makeNewNode(value);
        this._addNodeToArray(newNode);
        if(this._tree.rootIndex === -1)
        {
            this._changeRoot(newNode.index);
            this._changeValue(newNode, BinarySearchTree.PARENT, -1);
            return newNode;
        }
        const addParent = this._findAddParent(newNode);
        this._addToParent(newNode, addParent);
        return newNode;
    }

    _findAddParent(node){
        let potentialParent = this._tree.nodes[this._tree.rootIndex];
        while(potentialParent !== null){
            this._addHistoryStepCompare(node.index, potentialParent.index);
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
                this._changeRoot(-1);
                return;
            }
            this._changeRoot(newChildNode.index);
            if(newChildNode) newChildNode.parent = -1;
            return;
        }
        this._removeParentRelationship(childNode.index, parentIndex);
        if(newChildNode){
            this._addParentChildRelationship(newChildNode.index, parentIndex);
        }
    }

    _removeParentRelationship(childIndex, parentIndex){
        let childNode = this._tree.nodes[childIndex];
        childNode.parent = -1;
        if(parentIndex === -1){
            return;
        }
        let parentNode = this._tree.nodes[parentIndex];
        if(parentNode.left === childIndex){
            parentNode.left = -1;
        } else if(parentNode.right === childIndex){
            parentNode.right = -1;
        }else{
            throw new Error(`no parent child relationship from ${parentNode.index} to ${childNode.index}`);
        }
    }

    _addParentChildRelationship(childIndex, parentIndex){
        let childNode = this._tree.nodes[childIndex];
        childNode.parent = parentIndex;
        if(parentIndex === -1){
            return;
        }
        let parentNode = this._tree.nodes[parentIndex];
        if(childNode.value <= parentNode.value){
            if(parentNode.left !== -1){
                throw new Error(`parent node ${parentNode.index} is trying to assign an occupied left to ${childNode.index}`);
            }
            parentNode.left = childIndex;
        } else{
            if(parentNode.right !== -1){
                throw new Error(`parent node ${parentNode.index} is trying to assign an occupied right to ${childNode.index}`);
            }
            parentNode.right = childIndex;
        }

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

    _changeValue(node, attributeName, newValue){
        const oldValue = node[attributeName];
        node[attributeName] = newValue;
        this._addHistoryStepChange(node.index,attributeName,newValue,oldValue);
    }

    _changeRoot(newRootIndex, noHistory){
        const oldRoot = this._tree.rootIndex;
        this._tree.rootIndex = newRootIndex;
        if(noHistory) return;
        this._addHistoryStepChange(-1,BinarySearchTree.ROOT,newRootIndex,oldRoot);
    }

    _makeActionHistory(name, value){
        this._history.addAction({
            name: name,
            value: value,
        })
    }

    _addHistoryStepChange(nodeIndex, attributeName, attributeValue, oldValue){
        this._history.addStep({
            type:BinarySearchTree.CHANGE,
            index:nodeIndex,
            attribute:attributeName,
            value:attributeValue,
            oldValue: oldValue,
        });
    }
    
    _addHistoryStepCompare(primaryNodeIndex, SecondaryNodeIndex){
        this._history.addStep({
            type:BinarySearchTree.COMPARE,
            primaryIndex:primaryNodeIndex,
            secondaryIndex:SecondaryNodeIndex,
        });
    }
    
    _addHistoryStepNote(nodeIndex, note){
        return;
        this._history.addStep({
            type:BinarySearchTree.NOTE,
            index:nodeIndex,
            note:note,
        });
    }

    _addToParent(newNode, parentNode){
        this._changeValue(newNode, BinarySearchTree.PARENT, parentNode.index);
        if(newNode.value <= parentNode.value){
            if(parentNode.left !== -1) throw new Error(`tried to add left child in occupied spot p:${parentNode.index}`)
            parentNode.left = newNode.index;
        }
        else{
            if(parentNode.right !== -1) throw new Error(`tried to add right child in occupied spot p:${parentNode.index}`)
            parentNode.right = newNode.index;
        }
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