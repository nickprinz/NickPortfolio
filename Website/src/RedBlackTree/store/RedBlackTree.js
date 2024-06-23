import BinarySearchTree from "./BinarySearchTree";
export default class RedBlackTree extends BinarySearchTree{

    _performAdd(value){
        const newNode = super._performAdd(value);
        newNode.isRed = true;
        if(this._tree.rootIndex === newNode.index){
            newNode.isRed = false;
            this._addHistoryRecordChange(newNode.index,"isRed",false);
        }
        this._rebalanceAdd(newNode);
        return newNode;
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
                this._addHistoryRecordNote(nodeToCheck.index,"add root");
                return
            };
            const parent = this._tree.nodes[nodeToCheck.parent];
            if(!parent.isRed) {
                this._addHistoryRecordNote(parent.index,"add black parent");
                return
            };//no change in black depth
            const uncle = this._getSibling(parent.index, this._tree.nodes);
            if(this._isNodeRed(uncle)){
                this._addHistoryRecordNote(uncle.index,"add red uncle");
                uncle.isRed = false;
                this._addHistoryRecordChange(uncle.index,"isRed",false);
                parent.isRed = false;
                this._addHistoryRecordChange(parent.index,"isRed",false);
                const grandParent = this._tree.nodes[parent.parent];
                grandParent.isRed = true;
                this._addHistoryRecordChange(grandParent.index,"isRed",true);
                nodeToCheck = grandParent;
                this._addHistoryRecordNote(grandParent.index,"repeat add rebalance");
                continue;
            }
            this._addHistoryRecordNote(uncle ? uncle.index : -1,"add black uncle");
            const grandParent = this._tree.nodes[parent.parent];
            if(!grandParent) {
                parent.isRed = false;//parent is root, just turn it black
                this._addHistoryRecordChange(parent.index,"isRed",false);
                return;
            }
            if(grandParent.left === parent.index){
                this._addHistoryRecordNote(parent.index,"add parent left child");
                if(parent.left !== nodeToCheck.index){
                    this._addHistoryRecordNote(nodeToCheck.index,"add node right child");
                    this._rotateLeft(parent, true);
                    this._addHistoryRecordChange(parent.index,"rotateLeft",true);
                }
                this._rotateRight(grandParent, true);
                this._addHistoryRecordChange(grandParent.index,"rotateRight",true);
                return;
            } else {
                this._addHistoryRecordNote(parent.index,"add parent right child");
                if(parent.right !== nodeToCheck.index){
                    this._addHistoryRecordNote(nodeToCheck.index,"add node left child");
                    this._rotateRight(parent, true);
                    this._addHistoryRecordChange(parent.index,"rotateRight",true);
                }
                this._rotateLeft(grandParent, true);
                this._addHistoryRecordChange(grandParent.index,"rotateLeft",true);
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
    }
    
    _rotateLeft(pivotNode, swapColors){
        const newParent = this._tree.nodes[pivotNode.right];
        pivotNode.right = newParent.left;
        const newChild = this._tree.nodes[pivotNode.right];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.left = pivotNode.index;
        this._cleanupRotation(pivotNode, newParent, swapColors);
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
        if(pivotNode.index === this._tree.rootIndex) this._tree.rootIndex = newParent.index;
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
