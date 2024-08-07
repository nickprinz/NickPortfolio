import RedBlackTree from "./SearchTree/RedBlackTree";

export function add(value, tree) {
    const rbt = new RedBlackTree(tree);
    const addedIndex = rbt.add(value);
    return addedIndex;
}

export function addMany(values, tree) {
    const rbt = new RedBlackTree(tree, false);
    let lastAddedIndex = -1;
    values.forEach(value => {
        lastAddedIndex = rbt.add(value);
    });
    return tree.rootIndex;
}

export function remove(value, tree) {
    const rbt = new RedBlackTree(tree);
    return rbt.remove(value);
}

export function removeIndex(index, tree) {
    const rbt = new RedBlackTree(tree);
    return rbt.removeIndex(index);
}

export function getClosestReplacement(removeIndex, tree){
    const rbt = new RedBlackTree(tree);
    return rbt.getClosestReplacement(removeIndex);
}

export function makeInitialTreeState(){
    return RedBlackTree.MakeInitialTree();
}

export function moveHistory(amount, tree){
    const rbt = new RedBlackTree(tree);
    rbt.moveHistory(amount);
}

export function moveHistoryToLast(tree){
    const rbt = new RedBlackTree(tree);
    rbt.moveHistoryToLast();
}

export function moveHistoryToCurrent(tree){
    const rbt = new RedBlackTree(tree);
    rbt.moveHistoryToCurrent();
}

export function setHistoryToPosition(actionIndex, stepIndex, tree){
    const rbt = new RedBlackTree(tree);
    rbt.setHistoryToPosition(actionIndex, stepIndex);
}
