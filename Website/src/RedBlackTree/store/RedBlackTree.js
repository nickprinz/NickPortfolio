import BinarySearchTree from "./BinarySearchTree";
export default class RedBlackTree extends BinarySearchTree{
    static ISRED = "isRed";
    static ROTATERIGHT = "rotateRight";
    static ROTATELEFT = "rotateLeft";

    _performAdd(value){
        const newNode = super._performAdd(value);
        newNode.isRed = true;
        if(this._tree.rootIndex === newNode.index){
            this._changeValue(newNode, RedBlackTree.ISRED, false, "add_root_black");
        }
        this.#rebalanceAdd(newNode);
        return newNode;
    }

    _undoHistoryStep(historyStep){
        if(historyStep.type !== BinarySearchTree.CHANGE){
            super._undoHistoryStep(historyStep);
            return;
        }
        if(historyStep.attribute === RedBlackTree.ROTATELEFT){
            const node = this._tree.nodes[historyStep.index];
            const parent = this._tree.nodes[node.parent];
            this.#rotateRight(parent, historyStep.value);
        } else if(historyStep.attribute === RedBlackTree.ROTATERIGHT){
            const node = this._tree.nodes[historyStep.index];
            const parent = this._tree.nodes[node.parent];
            this.#rotateLeft(parent, historyStep.value);
        } else{
            super._undoHistoryStep(historyStep);
        }
    }

    _redoHistoryStep(historyStep){
        if(historyStep.type !== BinarySearchTree.CHANGE){
            super._redoHistoryStep(historyStep);
            return;
        }
        if(historyStep.attribute === RedBlackTree.ROTATELEFT){
            const node = this._tree.nodes[historyStep.index];
            this.#rotateLeft(node, historyStep.value);
        } else if(historyStep.attribute === RedBlackTree.ROTATERIGHT){
            const node = this._tree.nodes[historyStep.index];
            this.#rotateRight(node, historyStep.value);
        } else{
            super._redoHistoryStep(historyStep);
        }
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
        }
    }

    #rebalanceAdd(newNode){
        let nodeToCheck = newNode;
        while(nodeToCheck){
            if(nodeToCheck.parent === -1) {
                return
            };
            const parent = this._tree.nodes[nodeToCheck.parent];
            if(!parent.isRed) {
                return
            };//no change in black depth
            const uncle = this._getSibling(parent.index, this._tree.nodes);
            if(this.#isNodeRed(uncle)){
                const grandParent = this._tree.nodes[parent.parent];
                const noteValues = {value1: newNode.value, value2: parent.value, value3: grandParent.value, value4: uncle.value}
                this._changeValue(uncle, RedBlackTree.ISRED, false, "add_red_parent_uncle", noteValues);
                this._changeValue(parent, RedBlackTree.ISRED, false, "add_red_parent_uncle", noteValues);
                this._changeValue(grandParent, RedBlackTree.ISRED, true, "add_red_parent_uncle", noteValues);
                nodeToCheck = grandParent;
                continue;
            }
            
            const grandParent = this._tree.nodes[parent.parent];
            if(!grandParent) {
                const noteValues = {value1: newNode.value, value2: parent.value}
                this._changeValue(parent, RedBlackTree.ISRED, false, "add_red_parent_root", noteValues);
                return;
            }
            
            const noteValues = {value1: newNode.value, value2: parent.value, value3: grandParent.value, 
                value4: uncle ? uncle.value : "null"}
            if(grandParent.left === parent.index){
                const interiorChild = parent.left !== nodeToCheck.index;
                const noteKey = interiorChild ? "add_black_uncle_left_right_child" : "add_black_uncle_left_left_child";
                if(interiorChild){
                    this.#rotateLeft(parent, false, noteKey, noteValues);
                }
                this.#rotateRight(grandParent, true, noteKey, noteValues);
                return;
            } else {
                const interiorChild = parent.right !== nodeToCheck.index;
                const noteKey = interiorChild ? "add_black_uncle_right_left_child" : "add_black_uncle_right_right_child";
                if(interiorChild){
                    this.#rotateRight(parent, false, noteKey, noteValues);
                }
                this.#rotateLeft(grandParent, true, noteKey, noteValues);
                return;
            }
        }
    }
    
    _removeSingleNode(removeNode){
        const {initialParent, finalParent} = super._removeSingleNode(removeNode);
        if(removeNode.isRed) return {initialParent, finalParent};
        this.#rebalanceRemove(null, finalParent);
        return {initialParent, finalParent};
    }

    #rebalanceRemove(replacedChild, parentIndex){
    
        if(parentIndex === -1){
            return;
        }
        
        let replacedChildIndex = replacedChild ? replacedChild.index : -1;
    
        let siblingNode = this._getOtherChild(parentIndex, replacedChildIndex, this._tree.nodes);
        if(!siblingNode){
            throw new Error(`somehow we got a null sibling of a doubleblack below ${parentIndex}`);
        }
    
        const parentNode = this._tree.nodes[parentIndex];
        if(this.#isNodeRed(siblingNode)){
            const noteValues = {value1: siblingNode.value, value2: parentNode.value}
            if(parentNode.left === siblingNode.index){
                let noteKey = "remove_black_node_red_sibling_right";
                this.#rotateRight(parentNode, true, noteKey, noteValues);
            }
            else{
                let noteKey = "remove_black_node_red_sibling_left";
                this.#rotateLeft(parentNode, true, noteKey, noteValues);
            }
            //in this case, the recursion is because the above steps tranform the problem into a black sibling case
            this.#rebalanceRemove(replacedChild, parentIndex);
            return;
        }
    
        if(!this.#isNodeRed(this._tree.nodes[siblingNode.left]) && !this.#isNodeRed(this._tree.nodes[siblingNode.right])){
            const noteKey = parentNode.isRed ? 
            "remove_black_node_black_sibling_with_black_children_red_parent" :
            "remove_black_node_black_sibling_with_black_children_black_parent";
            const noteValues = {value1: siblingNode.value, value2: parentNode.value}
            this._changeValue(siblingNode, RedBlackTree.ISRED, true, noteKey, noteValues);
            if(parentNode.isRed){
                this._changeValue(parentNode, RedBlackTree.ISRED, false, noteKey, noteValues);
                return;
            }
            this.#rebalanceRemove(parentNode, parentNode.parent);
            return;
        }
    
        const siblingLeft = this._tree.nodes[siblingNode.left];
        const siblingRight = this._tree.nodes[siblingNode.right];
        //if down here, there is a black sibling of a doubleblack node and that sibling has at least 1 red child
        if(parentNode.left === siblingNode.index){
            //need more adjustments to notes
            let noteKey = "remove_black_node_black_sibling_with_red_children_right";
            const noteValues = {
                value1: siblingNode.value, 
                value2: parentNode.value, 
                value3: siblingLeft ? siblingLeft.value : "null", 
                value4: siblingRight ? siblingRight.value : "null", 
            };
            if(this.#isNodeRed(siblingLeft) && this.#isNodeRed(siblingRight)){
                noteKey = "remove_black_node_black_sibling_with_red_children_right_two_red_children";
                this._changeValue(siblingLeft, RedBlackTree.ISRED, false, noteKey, noteValues);
                if(parentNode.isRed){
                    noteKey = "remove_black_node_black_sibling_with_red_children_right_two_red_children_red_parent";
                    this._changeValue(parentNode, RedBlackTree.ISRED, false, noteKey, noteValues);
                    this._changeValue(siblingNode, RedBlackTree.ISRED, true, noteKey, noteValues);
                }
            } else if(this.#isNodeRed(siblingRight)){
                noteKey = "remove_black_node_black_sibling_with_red_children_right_inner_red_child";
                this._changeValue(siblingRight, RedBlackTree.ISRED, parentNode.isRed, noteKey, noteValues);
                this.#rotateLeft(siblingNode, true, noteKey, noteValues);
            } else{
                noteKey = "remove_black_node_black_sibling_with_red_children_right_outer_red_child";
                this._changeValue(siblingLeft, RedBlackTree.ISRED, parentNode.isRed, noteKey, noteValues);
            }
            this.#rotateRight(parentNode, false, noteKey, noteValues);
        }
        else{
            //need more adjustments to notes
            let noteKey = "remove_black_node_black_sibling_with_red_children_left";
            const noteValues = {
                value1: siblingNode.value, 
                value2: parentNode.value, 
                value3: siblingRight ? siblingRight.value : "null", 
                value4: siblingLeft ? siblingLeft.value : "null", 
            };
            if(this.#isNodeRed(siblingLeft) && this.#isNodeRed(siblingRight)){
                noteKey = "remove_black_node_black_sibling_with_red_children_left_two_red_children";
                this._changeValue(siblingRight, RedBlackTree.ISRED, false, noteKey, noteValues);
                if(parentNode.isRed){
                    noteKey = "remove_black_node_black_sibling_with_red_children_left_two_red_children_red_parent";
                    this._changeValue(parentNode, RedBlackTree.ISRED, false, noteKey, noteValues);
                    this._changeValue(siblingNode, RedBlackTree.ISRED, true, noteKey, noteValues);
                }
            } else if(this.#isNodeRed(siblingLeft)){
                noteKey = "remove_black_node_black_sibling_with_red_children_left_inner_red_child";
                this._changeValue(siblingLeft, RedBlackTree.ISRED, parentNode.isRed, noteKey, noteValues);
                this.#rotateRight(siblingNode, true, noteKey, noteValues);
            } else{
                noteKey = "remove_black_node_black_sibling_with_red_children_left_outer_red_child";
                this._changeValue(siblingRight, RedBlackTree.ISRED, parentNode.isRed, noteKey, noteValues);
            }
            this.#rotateLeft(parentNode, false, noteKey, noteValues);
        }
    
    }

    #rotateRight(pivotNode, swapColors, noteKey, noteValues){
        const newParent = this._tree.nodes[pivotNode.left];
        pivotNode.left = newParent.right;
        const newChild = this._tree.nodes[pivotNode.left];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.right = pivotNode.index;
        this.#cleanupRotation(pivotNode, newParent, swapColors);
        this._addHistoryStepChange(pivotNode.index, RedBlackTree.ROTATERIGHT, swapColors, null, noteKey, noteValues);
    }
    
    #rotateLeft(pivotNode, swapColors, noteKey, noteValues){
        const newParent = this._tree.nodes[pivotNode.right];
        pivotNode.right = newParent.left;
        const newChild = this._tree.nodes[pivotNode.right];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.left = pivotNode.index;
        this.#cleanupRotation(pivotNode, newParent, swapColors);
        this._addHistoryStepChange(pivotNode.index, RedBlackTree.ROTATELEFT, swapColors, null, noteKey, noteValues);
    }
    
    #cleanupRotation(pivotNode, newParent, swapColors){
        const grandParent = this._tree.nodes[pivotNode.parent];
        if(grandParent){
            if(grandParent.left === pivotNode.index){
                grandParent.left = newParent.index;
            } else{
                grandParent.right = newParent.index;
            }
        }
        newParent.parent = pivotNode.parent;
        pivotNode.parent = newParent.index;
        this._recalculateDepthBelow(pivotNode);
        this._recalculateDepthBelow(newParent);
        this._recalculateChildCount(pivotNode);
        this._recalculateChildCount(newParent);
        if(swapColors) this.#swapNodeColors(pivotNode, newParent);
        if(pivotNode.index === this._tree.rootIndex) {
            this._tree.rootIndex = newParent.index;
        };
    }

    #isNodeRed(node){
        return node && node.isRed;
    }

    #swapNodeColors(node1, node2){
        const tempRed = node1.isRed;
        node1.isRed = node2.isRed;
        node2.isRed = tempRed;
    }

}
