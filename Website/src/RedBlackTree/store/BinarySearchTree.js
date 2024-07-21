import TreeHistory from "./TreeHistory";

const historyCount = 10;

export default class BinarySearchTree{

    static PARENT = "parent";
    static CHANGE = "change";
    static COMPARE = "compare";
    static NOTE = "note";
    static ROOT = "root";
    static SWAP = "swap";

    static MakeInitialTree(){
        return {
            nodes: [],
            rootIndex: -1,
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
        this._makeActionHistory(`add`, value);
        const addedNode = this._performAdd(value);
        return addedNode.index;
    }

    remove(value) {
        this._history.moveHistoryToCurrent();
        let removeNode = this.#findFirstNode(value);
        if(!removeNode){
            throw new Error(`could not find node ${value} in tree`)
        }
        return this._removeSingleNode(removeNode);
    }
    
    removeIndex(index) {
        this._history.moveHistoryToCurrent();
        if(index < 0 || index >= this._tree.nodes.length || this._tree.nodes[index] === null){
            throw new Error(`could not find index ${index} in tree`)
        }
        return this._removeSingleNode(this._tree.nodes[index]);
    }

    getClosestReplacement(removeIndex){
        if(removeIndex === -1) return -1;
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
        if(historyStep.type === BinarySearchTree.ROOT){
            this._tree.rootIndex = historyStep.oldValue;
            if(historyStep.oldValue === -1) return;
            const newRootNode = this._tree.nodes[historyStep.oldValue];
            newRootNode.parent = historyStep.oldRootParentIndex;
            return;
        }

        if(historyStep.type !== BinarySearchTree.CHANGE) return;

        if(historyStep.attribute === BinarySearchTree.PARENT){
            this.#removeParentRelationship(historyStep.index, historyStep.value);
            this.#addToParent(historyStep.index, historyStep.oldValue);
            return;
        }

        const node = this._tree.nodes[historyStep.index];
        node[historyStep.attribute] = historyStep.oldValue;
    }

    _redoHistoryStep(historyStep){
        if(historyStep.type === BinarySearchTree.ROOT){
            this._tree.rootIndex = historyStep.value;
            if(historyStep.value === -1) return;
            const newRootNode = this._tree.nodes[historyStep.value];
            newRootNode.parent = -1;
            return;
        }

        if(historyStep.type !== BinarySearchTree.CHANGE) return;

        if(historyStep.attribute === BinarySearchTree.PARENT){
            this.#removeParentRelationship(historyStep.index, historyStep.oldValue);
            this.#addToParent(historyStep.index, historyStep.value);
            return;
        }
        const node = this._tree.nodes[historyStep.index];
        node[historyStep.attribute] = historyStep.value;
    }

    _performAdd(value){
        const newNode = this._makeNewNode(value);
        this.#addNodeToArray(newNode);
        if(this._tree.rootIndex === -1)
        {
            this._changeRoot(newNode.index, "first_root");
            return newNode;
        }
        const addParent = this.#findAddParent(newNode);
        this.#addToParent(newNode.index, addParent.index);
        return newNode;
    }

    #findAddParent(node){
        let potentialParent = this._tree.nodes[this._tree.rootIndex];
        while(potentialParent !== null){
            const isLess = node.value <= potentialParent.value;
            const noteValues = {value1: node.value, value2: potentialParent.value};
            this._addHistoryStepCompare(node.index, potentialParent.index, isLess ? "add_compare_values_less" : "add_compare_values_greater", noteValues);
            if(isLess){
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

    #addNodeToArray(newNode){
        newNode.index = this._tree.nodes.length;
        this._tree.nodes.push(newNode);
    
        newNode.id = this.#generateId();
    }

    _removeSingleNode(removeNode){
        this._makeActionHistory(`remove`, removeNode.value);
        return this.#removeSingleNode(removeNode);
    }

    #removeSingleNode(removeNode){
        if(removeNode.left !== -1 && removeNode.right !== -1){
            //both children exist, need to find leftmost child in right tree
            let swapChild = this.#findMin(this._tree.nodes[removeNode.right]);
            this.#swapNodesInTree(removeNode, swapChild, "swap_right_leftmost", {value1: removeNode.value, value2: swapChild.value});
            return this.#removeSingleNode(removeNode);
        }

        const parentIndex = removeNode.parent;
        let replacedChild = null;
        if(removeNode.right !== -1){
            replacedChild = this._tree.nodes[removeNode.right];
        } else if(removeNode.left !== -1){
            replacedChild = this._tree.nodes[removeNode.left];
        }
        
        if(replacedChild === null){
            this.#removeParentRelationship(removeNode.index, parentIndex);
        }
        else{
            this.#swapNodesInTree(removeNode, replacedChild, "swap_child", {value1: removeNode.value, value2: replacedChild.value});
            return this.#removeSingleNode(removeNode);
        }
        
        return parentIndex;

    }

    #findMin(startNode){
        let node = startNode;
        while(node.left >= 0){
            node = this._tree.nodes[node.left];
        }
        return node;
    }
    
    #findFirstNode(value){
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

    #swapNodesInTree(node1, node2, note, noteValues){
        //the memory object keeps its value and id but moves to a new position in the tree and new index in the array
        let tempNode = {...node1};
        Object.assign(node1, node2);
        node1.value = tempNode.value;
        node1.id = tempNode.id;
        let tempVal2 = node2.value;
        let tempId2 = node2.id;
        Object.assign(node2, tempNode);
        node2.value = tempVal2;
        node2.id = tempId2;
        this._tree.nodes[node1.index] = node1;
        this._tree.nodes[node2.index] = node2;
        this._addHistoryStepSwap(node1.index, node2.index, note, noteValues);

    }

    #removeParentRelationship(childIndex, parentIndex){
        let childNode = this._tree.nodes[childIndex];
        if(parentIndex === -1){
            this._changeValue(childNode, BinarySearchTree.PARENT, -1, "remove_parent_null", 
                {value1: childNode.value, value2: "null"});
            if(this._tree.rootIndex === childIndex){
                this._tree.rootIndex = -1;
            }
            return;
        }
        let parentNode = this._tree.nodes[parentIndex];
        this._changeValue(childNode, BinarySearchTree.PARENT, -1, "remove_from", 
            {value1: childNode.value, value2: parentNode.value});
        
        if(parentNode.left === childIndex){
            parentNode.left = -1;
        } else if(parentNode.right === childIndex){
            parentNode.right = -1;
        }else{
            throw new Error(`no parent child relationship from ${parentNode.index} to ${childNode.index}`);
        }
        
        this._adjustChildCount(parentNode.index, -1);
    }

    #addToParent(childIndex, parentIndex){
        let childNode = this._tree.nodes[childIndex];
        if(parentIndex === -1){
            this._changeValue(childNode, BinarySearchTree.PARENT, -1, "add_parent_null", 
                {value1: childNode.value, value2: "null"});
            if(this._tree.rootIndex === -1){
                this._tree.rootIndex = childNode.index;
            }
            return;
        }

        let parentNode = this._tree.nodes[parentIndex];

        const isLess = childNode.value <= parentNode.value;
        this._changeValue(childNode, BinarySearchTree.PARENT, parentIndex, isLess ? "add_insert_less" : "add_insert_greater", 
            {value1: childNode.value, value2: parentNode.value});
        if(isLess){
            if(parentNode.left !== -1) throw new Error(`tried to add left child in occupied spot p:${parentNode.index}`)
            parentNode.left = childNode.index;
        }
        else{
            if(parentNode.right !== -1) throw new Error(`tried to add right child in occupied spot p:${parentNode.index}`)
            parentNode.right = childNode.index;
        }
        this._adjustChildCount(parentNode.index, 1);
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

    _changeValue(node, attributeName, newValue, note, noteValues){
        const oldValue = node[attributeName];
        node[attributeName] = newValue;
        this._addHistoryStepChange(node.index,attributeName,newValue, oldValue, note, noteValues);
    }

    _changeRoot(newRootIndex, note){
        const oldRoot = this._tree.rootIndex;
        this._tree.rootIndex = newRootIndex;
        if(newRootIndex === -1){
            this._addHistoryStepRootChange(newRootIndex, oldRoot, -1, note);
            return;
        }
        const newRootNode = this._tree.nodes[newRootIndex];
        const oldRootParentIndex = newRootNode.parent;
        newRootNode.parent = -1;
        this._addHistoryStepRootChange(newRootIndex, oldRoot, oldRootParentIndex, note);//in order to group with a parent change, root might need to be a new type
    }

    _makeActionHistory(name, value){
        this._history.addAction({
            name: name,
            value: value,
        })
    }

    _addHistoryStepRootChange(value, oldValue, oldRootParentIndex, note, noteValues){
        //outside of a rotate, which handles its own history, a node only stops being root if it is removed
        //because of this, we don't need to track the parent of the old root
        this._history.addStep({
            type:BinarySearchTree.ROOT,
            value:value,
            oldValue: oldValue,
            oldRootParentIndex: oldRootParentIndex,
            note: note,
            noteValues: noteValues,
        });
    }

    _addHistoryStepChange(nodeIndex, attributeName, attributeValue, oldValue, note, noteValues){
        this._history.addStep({
            type:BinarySearchTree.CHANGE,
            index:nodeIndex,
            attribute:attributeName,
            value:attributeValue,
            oldValue: oldValue,
            note: note,
            noteValues: noteValues,
        });
    }
    
    _addHistoryStepCompare(primaryNodeIndex, SecondaryNodeIndex, note, noteValues){
        this._history.addStep({
            type:BinarySearchTree.COMPARE,
            primaryIndex:primaryNodeIndex,
            secondaryIndex:SecondaryNodeIndex,
            note: note,
            noteValues: noteValues,
        });
    }
    
    _addHistoryStepSwap(primaryNodeIndex, SecondaryNodeIndex, note, noteValues){
        this._history.addStep({
            type:BinarySearchTree.SWAP,
            primaryIndex:primaryNodeIndex,
            secondaryIndex:SecondaryNodeIndex,
            note: note,
            noteValues: noteValues,
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

    _adjustChildCount(parentIndex, changeAmount){
        while(parentIndex !== -1){
            const parentNode = this._tree.nodes[parentIndex];
            parentNode.childCount += changeAmount;
            this._recalculateDepthBelow(parentNode, this._tree.nodes);
            parentIndex = parentNode.parent;
        }
    }
    
    _recalculateDepthBelow(node){
        node.depthBelow = this.#getHighestDepth(node.left, node.right) + 1;
    }
    
    #getHighestDepth(index1, index2){
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