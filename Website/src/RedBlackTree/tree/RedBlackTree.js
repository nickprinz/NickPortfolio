
export default class RedBlackTree{
    #root;
    #nodeArray;
    #freeIndexes;

    //want to have an array with an openPositions queue when things get removed to keep an index based storage
    
    constructor(){
        this.#root = null;
        this.#nodeArray = [];
        this.#freeIndexes = [];
    }

    add = (value) => {
        const newNode = new RedBlackNode(value);
        this.#addNodeToArray(newNode);
        if(this.#root === null)
        {
            this.#root = newNode;
            this.#root.depth = 1
            this.#root.childCount = 0;
            this.#root.isRed = false;
            return;
        }
        newNode.isRed = true;
        const addParent = this.#findAddParent(newNode);//will need to add these checks to the history
        this.#addToParent(newNode, addParent);
        //will need to balance to turn this from bst to rbt
    }

    remove(value) {
        let removeNode = this.#findFirstNode(value);
        if(!removeNode){
            throw new Error(`could not find node ${value} in tree`)
        }
        this.#removeNode(removeNode)
    }

    removeIndex(index) {
        if(index < 0 || index >= this.#nodeArray.length || this.#nodeArray[index] === null){
            throw new Error(`could not find index ${index} in tree`)
        }
        this.#removeNode(this.#nodeArray[index])
    }

    count() {
        return this.#nodeArray.length - this.#freeIndexes.length;
    }

    getFromIndex(index){
        if(index < 0 || index >= this.#nodeArray.length) return null;
        return {...this.#nodeArray[index]};
    }

    getRoot(){
        if(!this.#root) return null;
        return {...this.#root};
    }

    #removeNode(removeNode){
        if(removeNode.left === -1 && removeNode.right === -1){
            this.#updateParentChildRelationship(removeNode.parent, removeNode, null);
        } else if(removeNode.left === -1){
            this.#updateParentChildRelationship(removeNode.parent, removeNode, this.#nodeArray[removeNode.right]);
        } else if(removeNode.right === -1){
            this.#updateParentChildRelationship(removeNode.parent, removeNode, this.#nodeArray[removeNode.left]);
        }
        else{
            //both children exist, need to find leftmost child in right tree
            let swapChild = this.#findMin(this.#nodeArray[removeNode.right]);
            this.#swapNodesInTree(removeNode, swapChild);
            this.#removeNode(swapChild);
            return;
        }

        this.#removeNodeFromArray(removeNode);

    }

    #findAddParent(node){
        let potentialParent = this.#root;
        while(potentialParent !== null){
            if(node.value <= potentialParent.value){
                if(potentialParent.left === -1) {
                    return potentialParent
                };
                potentialParent = this.#nodeArray[potentialParent.left];
            }
            else{
                if(potentialParent.right === -1) {
                    return potentialParent
                };
                potentialParent = this.#nodeArray[potentialParent.right];
            }
        }

        throw new Error(`somehow tree could not find a parent node for ${node.value}`);
    }

    #addNodeToArray(newNode){
        if(this.#freeIndexes.length > 0){
            newNode.index = this.#freeIndexes.pop();
            this.#nodeArray[newNode.index] = newNode;
        }

        newNode.index = this.#nodeArray.length;
        this.#nodeArray.push(newNode);
    }

    #removeNodeFromArray(removingNode){
        this.#freeIndexes.push(removingNode.index);
        this.#nodeArray[removingNode.index] = null;
    }

    #updateChildCounts(parent, amount){
        while(parent !== null){
            parent.childCount += amount;
            parent = parent.parent === -1 ? null : this.#nodeArray[parent.parent];
        }
    }

    #findFirstNode(value){
        let possibleNode = this.#root;
        while(possibleNode){
            if(value === possibleNode.value){
                return possibleNode;
            }
            if(value <= possibleNode.value){
                possibleNode = this.#nodeArray[possibleNode.left];
            }
            else{
                possibleNode = this.#nodeArray[possibleNode.right];
            }
        }
        return null;
    }

    #updateParentChildRelationship(parentIndex, childNode, newChildNode){
        if(parentIndex === -1){
            this.#root = newChildNode;
            if(newChildNode) newChildNode.parent = -1;
            return;
        }

        let parentNode = this.#nodeArray[parentIndex];
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

    #addToParent(newNode, parentNode){
        this.#updateChildCounts(parentNode, 1)
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

    #findMin(startNode){
        let node = startNode;
        while(node.left >= 0){
            node = this.#nodeArray[node.left];
        }
        return node;
    }

    #swapNodesInTree(node1, node2){
        //for now this just swaps the values in the object at each index
        let tempVal1 = node1.value;
        node1.value = node2.value;
        node2.value = tempVal1;
    }

}

export class RedBlackNode{
    isRed = false;
    value = 0;
    childCount = 0;
    depth = 1;
    left = -1;
    right = -1;
    parent = -1;
    index = -1;
    constructor(v){
        this.value = v;
    }
}
