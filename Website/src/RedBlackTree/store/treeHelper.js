import RedBlackTree from "./RedBlackTree";

export function add(value, tree) {
    const rbt = new RedBlackTree(tree);
    const addedIndex = rbt.add(value);
    return addedIndex;
}

export function remove(value, tree) {
    const rbt = new RedBlackTree(tree);
    rbt.remove(value);
}

export function removeIndex(index, tree) {
    const rbt = new RedBlackTree(tree);
    rbt.removeIndex(index);
}

export function getTreeSection(initialIndex, levelsUp, totalLevels, tree){
    const rbt = new RedBlackTree(tree);
    return rbt.getTreeSection(initialIndex, levelsUp, totalLevels);
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
