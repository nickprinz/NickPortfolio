import { root } from "postcss";

export default class RedBlackTree{
    root;
    #nodeArray;
    #freeIndexes;

    //want to have an array with an openPositions queue when things get removed to keep an index based storage
    
    constructor(){
        this.root = null;
        this.#nodeArray = [];
        this.#freeIndexes = [];
    }

    add = (value) => {
        const newNode = new RedBlackNode(value);
        this.#addNodeToArray(newNode);
        if(this.root === null)
        {
            this.root = newNode;
            this.root.depth = 1
            this.root.childCount = 0;
            this.root.isRed = false;
            return;
        }
        newNode.isRed = true;
        const addParent = this.#findAddParent(newNode);//will need to add these checks to the history
        this.#updateChildCounts(addParent, 1)
        newNode.parent = addParent.index;
        newNode.depth = addParent.depth+1;//might also want a below depth
        if(newNode.value <= addParent.value){
            addParent.left = newNode.index;
        }
        else{
            addParent.right = newNode.index;
        }
        //will need to balance to turn this from bst to rbt
    }

    remove(value) {
        let removeNode = this.#findFirstNode(value);
        if(!removeNode){
            throw new Error(`could not find node ${value} in tree`)
        }
        this.#removeNodeFromArray(removeNode);
        if(removeNode.parent === -1){
            //is root, will not update parent
        }


        this.#updateChild(this.#nodeArray[removeNode.parent], removeNode, null);
        
    }

    count() {
        return this.#nodeArray.length - this.#freeIndexes.length;
    }

    getFromIndex(index){
        if(index < 0 || index >= this.#nodeArray.length) return null;
        return this.#nodeArray[index];
    }

    #findAddParent(node){
        let potentialParent = this.root;
        while(potentialParent !== null){
            if(node.value <= potentialParent.value){
                if(potentialParent.left === -1) {
                    console.log(`found left ${potentialParent.index}`)
                    return potentialParent
                };
                potentialParent = this.#nodeArray[potentialParent.left];
            }
            else{
                if(potentialParent.right === -1) {
                    console.log(`found right ${potentialParent.index}`)
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
        let possibleNode = this.root;
        while(possibleNode !== null){
            if(value === possibleNode){
                return possibleNode;
            }
            if(value <= possibleNode){
                possibleNode = this.#nodeArray[possibleNode.left];
            }
            else{
                possibleNode = this.#nodeArray[possibleNode.right];
            }
        }
        return null;
    }

    #updateChild(parentNode, childNode, newChildNode){

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
