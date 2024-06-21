import BinarySearchTree from "./BinarySearchTree";
export default class RedBlackTree extends BinarySearchTree{

    static _performAdd(value, tree, actionHistory){
        const newNode = super._performAdd(value, tree, actionHistory);
        newNode.isRed = true;
        if(tree.rootIndex === newNode.index){
            newNode.isRed = false;
            this._addHistoryRecordChange(actionHistory,newNode.index,"isRed",false);
        }
        this._rebalanceAdd(newNode, tree);
        return newNode;
    }
    
    static _removeSingleNode(removeNode, tree){
        const parentIndex = removeNode.parent;
        const replacedChild = super._removeSingleNode(removeNode, tree);
        if(replacedChild === undefined) return;
        if(removeNode.isRed) return replacedChild;
        this._rebalanceRemove(replacedChild, parentIndex, tree);
        return replacedChild;
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
        }
    }

    static _rebalanceAdd(newNode, tree){
        let nodeToCheck = newNode;
        while(nodeToCheck){
            if(nodeToCheck.parent === -1) return;
            const parent = tree.nodes[nodeToCheck.parent];
            if(!parent.isRed) return;//no change in black depth
            const uncle = this._getSibling(parent.index, tree.nodes);
            if(this._isNodeRed(uncle)){
                uncle.isRed = false;
                parent.isRed = false;
                const grandParent = tree.nodes[parent.parent];
                grandParent.isRed = true;
                nodeToCheck = grandParent;
                continue;
            }
            const grandParent = tree.nodes[parent.parent];
            if(!grandParent) {
                parent.isRed = false;//parent is root, just turn it black
                return;
            }
            if(grandParent.left === parent.index){
                if(parent.left !== nodeToCheck.index){
                    this._rotateLeft(parent, true, tree);
                }
                this._rotateRight(grandParent, true, tree);
                return;
            } else {
                if(parent.right !== nodeToCheck.index){
                    this._rotateRight(parent, true, tree);
                }
                this._rotateLeft(grandParent, true, tree);
                return;
            }
        }
    }

    static _rebalanceRemove(replacedChild, parentIndex, tree){
    
        if(parentIndex === -1){
            return;
        }
        if(this._isNodeRed(replacedChild)){
            replacedChild.isRed = false;
            return;//removed child takes up the removed node's black position
        }
        
        let replacedChildIndex = replacedChild ? replacedChild.index : -1;
    
        let siblingNode = this._getOtherChild(parentIndex, replacedChildIndex, tree.nodes);
        if(!siblingNode){
            throw new Error(`somehow we got a null sibling of a doubleblack below ${parentIndex}`);
        }
    
        const parentNode = tree.nodes[parentIndex];
        if(this._isNodeRed(siblingNode)){
            siblingNode.isRed = false;
            parentNode.isRed = true;
            if(parentNode.left === siblingNode.index){
                this._rotateRight(parentNode, false, tree);
            }
            else{
                this._rotateLeft(parentNode, false, tree);
            }
            this._rebalanceRemove(replacedChild, parentIndex, tree);
            return;
        }
    
        if(!this._isNodeRed(tree.nodes[siblingNode.left]) && !this._isNodeRed(tree.nodes[siblingNode.right])){
            siblingNode.isRed = true;
            if(parentNode.isRed){
                parentNode.isRed = false;
                return;
            }
            this._rebalanceRemove(parentNode, parentNode.parent, tree);
            return;
        }
    
        //if down here, there is a black sibling of a doubleblack node and that sibling has at least 1 red child
        if(parentNode.left === siblingNode.index){
            if(!this._isNodeRed(tree.nodes[siblingNode.left])){
                tree.nodes[siblingNode.right].isRed = parentNode.isRed;
                this._rotateLeft(siblingNode, true, tree);
            }
            else if(this._isNodeRed(tree.nodes[siblingNode.left]) && this._isNodeRed(tree.nodes[siblingNode.right])){
                this._swapNodeColors(siblingNode, tree.nodes[siblingNode.left]);
                if(parentNode.isRed){
                    parentNode.isRed = false;
                }
                else{
                    siblingNode.isRed = false;
                }
            }else{
                tree.nodes[siblingNode.left].isRed = parentNode.isRed;
            }
            this._rotateRight(parentNode, false, tree);
        }
        else{
            if(!this._isNodeRed(tree.nodes[siblingNode.right])){
                tree.nodes[siblingNode.left].isRed = parentNode.isRed;
                this._rotateRight(siblingNode, true, tree);
            }
            else if(this._isNodeRed(tree.nodes[siblingNode.left]) && this._isNodeRed(tree.nodes[siblingNode.right])){
                this._swapNodeColors(siblingNode, tree.nodes[siblingNode.right]);
                if(parentNode.isRed){
                    parentNode.isRed = false;
                }
                else{
                    siblingNode.isRed = false;
                }
            }else{
                tree.nodes[siblingNode.right].isRed = parentNode.isRed;
            }
            this._rotateLeft(parentNode, false, tree);
        }
    
    }

    static _rotateRight(pivotNode, swapColors, tree){
        const newParent = tree.nodes[pivotNode.left];
        pivotNode.left = newParent.right;
        const newChild = tree.nodes[pivotNode.left];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.right = pivotNode.index;
        this._cleanupRotation(pivotNode, newParent, swapColors, tree);
    }
    
    static _rotateLeft(pivotNode, swapColors, tree){
        const newParent = tree.nodes[pivotNode.right];
        pivotNode.right = newParent.left;
        const newChild = tree.nodes[pivotNode.right];
        if(newChild) newChild.parent = pivotNode.index;
        newParent.left = pivotNode.index;
        this._cleanupRotation(pivotNode, newParent, swapColors, tree);
    }
    
    static _cleanupRotation(pivotNode, newParent, swapColors, tree){
        const grandParent = tree.nodes[pivotNode.parent];
        if(grandParent){
            if(grandParent.left === pivotNode.index){
                grandParent.left = newParent.index;
            } else{
                grandParent.right = newParent.index;
            }
        }
        newParent.parent = pivotNode.parent;
        pivotNode.parent = newParent.index;
        this._recalculateDepthBelow(pivotNode, tree.nodes);
        this._recalculateDepthBelow(newParent, tree.nodes);
        this._recalculateChildCount(pivotNode, tree.nodes);
        this._recalculateChildCount(newParent, tree.nodes);
        if(swapColors) this._swapNodeColors(pivotNode, newParent);
        if(pivotNode.index === tree.rootIndex) tree.rootIndex = newParent.index;
    }

    static _isNodeRed(node){
        return node && node.isRed;
    }

    static _swapNodeColors(node1, node2){
        const tempRed = node1.isRed;
        node1.isRed = node2.isRed;
        node2.isRed = tempRed;
    }

}

export function add(value, tree) {
    RedBlackTree.add(value, tree);
}

export function remove(value, tree) {
    RedBlackTree.remove(value, tree);
}

export function removeIndex(index, tree) {
    RedBlackTree.removeIndex(index, tree);
}

export function getTreeSection(initialIndex, levelsUp, totalLevels, nodes){
    return RedBlackTree.getTreeSection(initialIndex, levelsUp, totalLevels, nodes);
}

export function getClosestReplacement(removeIndex, nodes){
    return RedBlackTree.getClosestReplacement(removeIndex, nodes);
}



