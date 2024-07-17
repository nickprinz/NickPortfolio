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
        this._rebalanceAdd(newNode);
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
            this._rotateRight(parent, historyStep.value);
        } else if(historyStep.attribute === RedBlackTree.ROTATERIGHT){
            const node = this._tree.nodes[historyStep.index];
            const parent = this._tree.nodes[node.parent];
            this._rotateLeft(parent, historyStep.value);
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
            this._rotateLeft(node, historyStep.value);
        } else if(historyStep.attribute === RedBlackTree.ROTATERIGHT){
            const node = this._tree.nodes[historyStep.index];
            this._rotateRight(node, historyStep.value);
        } else{
            super._redoHistoryStep(historyStep);
        }
    }
    
    _removeSingleNode(removeNode){
        const parentIndex = removeNode.parent;
        const replacedChild = super._removeSingleNode(removeNode);
        if(replacedChild === undefined) return;
        if(removeNode.isRed) return replacedChild;
        this._rebalanceRemove(replacedChild, parentIndex);
        return replacedChild;
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

    _rebalanceAdd(newNode){
        let nodeToCheck = newNode;
        while(nodeToCheck){
            if(nodeToCheck.parent === -1) {
                this._addHistoryStepNote(nodeToCheck.index,"add root");
                return
            };
            const parent = this._tree.nodes[nodeToCheck.parent];
            if(!parent.isRed) {
                this._addHistoryStepNote(parent.index,"add black parent");
                return
            };//no change in black depth
            const uncle = this._getSibling(parent.index, this._tree.nodes);
            if(this._isNodeRed(uncle)){
                this._addHistoryStepNote(uncle.index,"add red uncle");
                this._changeValue(uncle, RedBlackTree.ISRED, false);
                this._changeValue(parent, RedBlackTree.ISRED, false);
                const grandParent = this._tree.nodes[parent.parent];
                this._changeValue(grandParent, RedBlackTree.ISRED, true);
                nodeToCheck = grandParent;
                this._addHistoryStepNote(grandParent.index,"repeat add rebalance");
                continue;
            }
            this._addHistoryStepNote(uncle ? uncle.index : -1,"add black uncle");
            const grandParent = this._tree.nodes[parent.parent];
            if(!grandParent) {
                this._changeValue(parent, RedBlackTree.ISRED, false);
                this._addHistoryStepNote(parent.index,"extra red absorbed by root");
                return;
            }
            if(grandParent.left === parent.index){
                this._addHistoryStepNote(parent.index,"add parent left child");
                if(parent.left !== nodeToCheck.index){
                    this._addHistoryStepNote(nodeToCheck.index,"add node right child");
                    this._rotateLeft(parent, true);
                }
                this._rotateRight(grandParent, true);
                return;
            } else {
                this._addHistoryStepNote(parent.index,"add parent right child");
                if(parent.right !== nodeToCheck.index){
                    this._addHistoryStepNote(nodeToCheck.index,"add node left child");
                    this._rotateRight(parent, true);
                }
                this._rotateLeft(grandParent, true);
                return;
            }
        }
    }

    _rebalanceRemove(replacedChild, parentIndex){
    
        if(parentIndex === -1){
            return;
        }
        if(this._isNodeRed(replacedChild)){
            replacedChild.isRed = false;
            return;//removed child takes up the removed node's black position
        }
        
        let replacedChildIndex = replacedChild ? replacedChild.index : -1;
    
        let siblingNode = this._getOtherChild(parentIndex, replacedChildIndex, this._tree.nodes);
        if(!siblingNode){
            throw new Error(`somehow we got a null sibling of a doubleblack below ${parentIndex}`);
        }
    
        const parentNode = this._tree.nodes[parentIndex];
        if(this._isNodeRed(siblingNode)){
            siblingNode.isRed = false;
            parentNode.isRed = true;
            if(parentNode.left === siblingNode.index){
                this._rotateRight(parentNode, false);
            }
            else{
                this._rotateLeft(parentNode, false);
            }
            this._rebalanceRemove(replacedChild, parentIndex);
            return;
        }
    
        if(!this._isNodeRed(this._tree.nodes[siblingNode.left]) && !this._isNodeRed(this._tree.nodes[siblingNode.right])){
            siblingNode.isRed = true;
            if(parentNode.isRed){
                parentNode.isRed = false;
                return;
            }
            this._rebalanceRemove(parentNode, parentNode.parent);
            return;
        }
    
        //if down here, there is a black sibling of a doubleblack node and that sibling has at least 1 red child
        if(parentNode.left === siblingNode.index){
            if(!this._isNodeRed(this._tree.nodes[siblingNode.left])){
                this._tree.nodes[siblingNode.right].isRed = parentNode.isRed;
                this._rotateLeft(siblingNode, true);
            }
            else if(this._isNodeRed(this._tree.nodes[siblingNode.left]) && this._isNodeRed(this._tree.nodes[siblingNode.right])){
                this._swapNodeColors(siblingNode, this._tree.nodes[siblingNode.left]);
                if(parentNode.isRed){
                    parentNode.isRed = false;
                }
                else{
                    siblingNode.isRed = false;
                }
            }else{
                this._tree.nodes[siblingNode.left].isRed = parentNode.isRed;
            }
            this._rotateRight(parentNode, false);
        }
        else{
            if(!this._isNodeRed(this._tree.nodes[siblingNode.right])){
                this._tree.nodes[siblingNode.left].isRed = parentNode.isRed;
                this._rotateRight(siblingNode, true);
            }
            else if(this._isNodeRed(this._tree.nodes[siblingNode.left]) && this._isNodeRed(this._tree.nodes[siblingNode.right])){
                this._swapNodeColors(siblingNode, this._tree.nodes[siblingNode.right]);
                if(parentNode.isRed){
                    parentNode.isRed = false;
                }
                else{
                    siblingNode.isRed = false;
                }
            }else{
                this._tree.nodes[siblingNode.right].isRed = parentNode.isRed;
            }
            this._rotateLeft(parentNode, false);
        }
    
    }

    _rotateRight(pivotNode, swapColors){
        const newParent = this._tree.nodes[pivotNode.left];
        pivotNode.left = newParent.right;
        const newChild = this._tree.nodes[pivotNode.left];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.right = pivotNode.index;
        this._cleanupRotation(pivotNode, newParent, swapColors);
        this._addHistoryStepChange(pivotNode.index, RedBlackTree.ROTATERIGHT, swapColors);
    }
    
    _rotateLeft(pivotNode, swapColors){
        const newParent = this._tree.nodes[pivotNode.right];
        pivotNode.right = newParent.left;
        const newChild = this._tree.nodes[pivotNode.right];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.left = pivotNode.index;
        this._cleanupRotation(pivotNode, newParent, swapColors);
        this._addHistoryStepChange(pivotNode.index, RedBlackTree.ROTATELEFT, swapColors);
    }
    
    _cleanupRotation(pivotNode, newParent, swapColors){
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
        if(swapColors) this._swapNodeColors(pivotNode, newParent);
        if(pivotNode.index === this._tree.rootIndex) this._changeRoot(newParent.index, true);//this is the one root change that does not require a parent change
    }

    _isNodeRed(node){
        return node && node.isRed;
    }

    _swapNodeColors(node1, node2){
        const tempRed = node1.isRed;
        node1.isRed = node2.isRed;
        node2.isRed = tempRed;
    }

}
