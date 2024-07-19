import BinarySearchTree from "./BinarySearchTree";
export default class RedBlackTree extends BinarySearchTree{
    static ISRED = "isRed";
    static ROTATERIGHT = "rotateRight";
    static ROTATELEFT = "rotateLeft";

    _performAdd(value){
        const newNode = super._performAdd(value);
        newNode.isRed = true;
        if(this._tree.rootIndex === newNode.index){
            this._changeValue(newNode, RedBlackTree.ISRED, false);
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
                this._changeValue(uncle, RedBlackTree.ISRED, false, "add_red_parent_uncle");
                this._changeValue(parent, RedBlackTree.ISRED, false, "add_red_parent_uncle");
                const grandParent = this._tree.nodes[parent.parent];
                this._changeValue(grandParent, RedBlackTree.ISRED, true, "add_red_parent_uncle");
                nodeToCheck = grandParent;
                continue;
            }
            
            const grandParent = this._tree.nodes[parent.parent];
            if(!grandParent) {
                this._changeValue(parent, RedBlackTree.ISRED, false, "add_red_parent_root");
                return;
            }
            if(grandParent.left === parent.index){
                const interiorChild = parent.left !== nodeToCheck.index;
                const noteKey = interiorChild ? "add_black_uncle_left_right_child" : "add_black_uncle_left_left_child";
                if(interiorChild){
                    this.#rotateLeft(parent, false, noteKey);
                }
                this.#rotateRight(grandParent, true, noteKey);
                return;
            } else {
                const interiorChild = parent.right !== nodeToCheck.index;
                const noteKey = interiorChild ? "add_black_uncle_right_left_child" : "add_black_uncle_right_right_child";
                if(interiorChild){
                    this.#rotateRight(parent, false, noteKey);
                }
                this.#rotateLeft(grandParent, true, noteKey);
                return;
            }
        }
    }
    
    _removeSingleNode(removeNode){
        const {replacementIndex, parentIndex} = super._removeSingleNode(removeNode);
        const replacedChild = this._tree.nodes[replacementIndex];
        if(removeNode.isRed) return {replacementIndex, parentIndex};
        this.#rebalanceRemove(replacedChild, parentIndex);
        return {replacementIndex, parentIndex}
    }

    #rebalanceRemove(replacedChild, parentIndex){
    
        if(parentIndex === -1){
            return;
        }
        if(this.#isNodeRed(replacedChild)){
            replacedChild.isRed = false;
            return;//removed child takes up the removed node's black position
        }
        
        let replacedChildIndex = replacedChild ? replacedChild.index : -1;
    
        let siblingNode = this._getOtherChild(parentIndex, replacedChildIndex, this._tree.nodes);
        if(!siblingNode){
            throw new Error(`somehow we got a null sibling of a doubleblack below ${parentIndex}`);
        }
    
        const parentNode = this._tree.nodes[parentIndex];
        if(this.#isNodeRed(siblingNode)){
            siblingNode.isRed = false;
            parentNode.isRed = true;
            if(parentNode.left === siblingNode.index){
                this.#rotateRight(parentNode, false);
            }
            else{
                this.#rotateLeft(parentNode, false);
            }
            this.#rebalanceRemove(replacedChild, parentIndex);
            return;
        }
    
        if(!this.#isNodeRed(this._tree.nodes[siblingNode.left]) && !this.#isNodeRed(this._tree.nodes[siblingNode.right])){
            siblingNode.isRed = true;
            if(parentNode.isRed){
                parentNode.isRed = false;
                return;
            }
            this.#rebalanceRemove(parentNode, parentNode.parent);
            return;
        }
    
        //if down here, there is a black sibling of a doubleblack node and that sibling has at least 1 red child
        if(parentNode.left === siblingNode.index){
            if(!this.#isNodeRed(this._tree.nodes[siblingNode.left])){
                this._tree.nodes[siblingNode.right].isRed = parentNode.isRed;
                this.#rotateLeft(siblingNode, true);
            }
            else if(this.#isNodeRed(this._tree.nodes[siblingNode.left]) && this.#isNodeRed(this._tree.nodes[siblingNode.right])){
                this.#swapNodeColors(siblingNode, this._tree.nodes[siblingNode.left]);
                if(parentNode.isRed){
                    parentNode.isRed = false;
                }
                else{
                    siblingNode.isRed = false;
                }
            }else{
                this._tree.nodes[siblingNode.left].isRed = parentNode.isRed;
            }
            this.#rotateRight(parentNode, false);
        }
        else{
            if(!this.#isNodeRed(this._tree.nodes[siblingNode.right])){
                this._tree.nodes[siblingNode.left].isRed = parentNode.isRed;
                this.#rotateRight(siblingNode, true);
            }
            else if(this.#isNodeRed(this._tree.nodes[siblingNode.left]) && this.#isNodeRed(this._tree.nodes[siblingNode.right])){
                this.#swapNodeColors(siblingNode, this._tree.nodes[siblingNode.right]);
                if(parentNode.isRed){
                    parentNode.isRed = false;
                }
                else{
                    siblingNode.isRed = false;
                }
            }else{
                this._tree.nodes[siblingNode.right].isRed = parentNode.isRed;
            }
            this.#rotateLeft(parentNode, false);
        }
    
    }

    #rotateRight(pivotNode, swapColors, noteKey){
        const newParent = this._tree.nodes[pivotNode.left];
        pivotNode.left = newParent.right;
        const newChild = this._tree.nodes[pivotNode.left];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.right = pivotNode.index;
        this.#cleanupRotation(pivotNode, newParent, swapColors);
        this._addHistoryStepChange(pivotNode.index, RedBlackTree.ROTATERIGHT, swapColors, null, noteKey);
    }
    
    #rotateLeft(pivotNode, swapColors, noteKey){
        const newParent = this._tree.nodes[pivotNode.right];
        pivotNode.right = newParent.left;
        const newChild = this._tree.nodes[pivotNode.right];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.left = pivotNode.index;
        this.#cleanupRotation(pivotNode, newParent, swapColors);
        this._addHistoryStepChange(pivotNode.index, RedBlackTree.ROTATELEFT, swapColors, null, noteKey);
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
