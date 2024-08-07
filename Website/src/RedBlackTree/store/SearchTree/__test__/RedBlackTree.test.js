
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react';
import RedBlackTree from '../RedBlackTree';
import validateTree from "../redBlackTreeValidator";
//need to add history tests
describe('red black tree', () => {
    afterEach(() => {
    cleanup();
    });

    it("should have no root when init", () => {
        const tree = RedBlackTree.MakeInitialTree();
        
        expect(tree.rootIndex).toBe(-1);
    })

    it("should add a root", () => {
        const tree = RedBlackTree.MakeInitialTree();
        const rbt = new RedBlackTree(tree);
        rbt.add(10);
        
        expect(tree.nodes[tree.rootIndex].value).toBe(10);
    })

    it("should nodes on each side", () => {
        const tree = makeFromValues([10,5,12]);
        const rbt = new RedBlackTree(tree);
        
        const r = tree.nodes[tree.rootIndex];
        expect(r.value).toBe(10);

        const l1 = tree.nodes[r.left];
        expect(l1.value).toBe(5);
        expect(l1.parent).toBe(r.index);
        expect(l1.left).toBe(-1);
        expect(l1.right).toBe(-1);

        const r1 = tree.nodes[r.right];
        expect(r1.value).toBe(12);
        expect(r1.parent).toBe(r.index);
        expect(r1.left).toBe(-1);
        expect(r1.right).toBe(-1);

        expect(tree.nodes.length).toBe(3);
    })

    it("should add and remove root", () => {
        const tree = RedBlackTree.MakeInitialTree();
        const rbt = new RedBlackTree(tree);
        rbt.add(10);
        
        expect(tree.nodes[tree.rootIndex].value).toBe(10);
        rbt.remove(10);
        expect(tree.rootIndex).toBe(-1);
    })

    it("should not reuse deleted indexes", () => {
        const tree = RedBlackTree.MakeInitialTree();
        const rbt = new RedBlackTree(tree);
        rbt.add(10);
        
        expect(tree.rootIndex).toBe(0);
        rbt.remove(10);
        expect(tree.rootIndex).toBe(-1);
        rbt.add(5);
        expect(tree.rootIndex).toBe(1);
        expect(tree.nodes[tree.rootIndex].value).toBe(5);
    })

    it("should remove node with 2 children", () => {
        const tree = makeFromValues([10,5,15,7,2]);
        const rbt = new RedBlackTree(tree);
        
        const r = tree.nodes[tree.rootIndex];
        expect(r.childCount).toBe(4);

        rbt.removeIndex(1);
        const l1 = tree.nodes[r.left];
        expect(l1.value).toBe(7);
        expect(l1.right).toBe(-1);
        expect(l1.left).not.toBe(-1);
        expect(r.childCount).toBe(3);
    })
 
    it("should update depthBelow", () => {
        const tree = RedBlackTree.MakeInitialTree();
        const rbt = new RedBlackTree(tree);
        rbt.add(10);
        const r = tree.nodes[tree.rootIndex];
        expect(r.depthBelow).toBe(0);
        rbt.add(5);
        expect(r.depthBelow).toBe(1);
        rbt.add(15);
        expect(r.depthBelow).toBe(1);
        rbt.add(7);
        expect(r.depthBelow).toBe(2);
        rbt.add(2);
        expect(r.depthBelow).toBe(2);

        rbt.removeIndex(3);
        expect(r.depthBelow).toBe(2);
        rbt.removeIndex(4);
        expect(r.depthBelow).toBe(1);
    })

    it("should recolor on add when parent and uncle are red", () => {
        const tree = makeFromValues([10,5,15]);
        const rbt = new RedBlackTree(tree);
        expect(tree.nodes[0].isRed).toBeFalsy();
        expect(tree.nodes[1].isRed).toBeTruthy();
        expect(tree.nodes[2].isRed).toBeTruthy();
        rbt.add(2);
        expect(tree.nodes[0].isRed).toBeTruthy();
        expect(tree.nodes[1].isRed).toBeFalsy();
        expect(tree.nodes[2].isRed).toBeFalsy();
    })

    it("should rotate right when 2 left nodes are added", () => {
        const tree = makeFromValues([10,5,3]);
        expect(tree.rootIndex).toBe(1);
    })

    it("should rotate right then left when a left then middle node is added", () => {
        const tree = makeFromValues([10,5,7]);
        expect(tree.rootIndex).toBe(2);
        expect(tree.nodes[2].childCount).toBe(2);
        expect(tree.nodes[0].childCount).toBe(0);
        expect(tree.nodes[1].childCount).toBe(0);
    })

    it("should handle a delete from root with one child", () => {
        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            expect(tree.rootIndex).toBe(0);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[0]);
            expect(tree.rootIndex).toBe(1);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
        }

        const inOrderValues = [1,2];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete with a red sibling", () => {
        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            expect(tree.rootIndex).toBe(1);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[0]);
            expect(tree.rootIndex).toBe(3);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [8,7,6,5,4,3,2];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete when a black sibling has an outer red child", () => {
        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            expect(tree.rootIndex).toBe(1);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[2]);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [8,7,6,5,4,3];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete when a black sibling has an inner red child", () => {
        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            expect(tree.rootIndex).toBe(0);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[1], tree);
            expect(tree.rootIndex).toBe(3);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [7,8,4,5];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete when a black sibling has 2 red children", () => {

        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            expect(tree.rootIndex).toBe(0);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[1], tree);
            expect(tree.rootIndex).toBe(2);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [7,8,4,5,3];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete with black parent when a black sibling has an inner red child only", () => {

        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            tree.nodes[0].isRed = false;
            tree.nodes[1].isRed = false;
            tree.nodes[2].isRed = false;
            tree.nodes[3].isRed = true;
            expect(tree.rootIndex).toBe(0);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[1], tree);
            expect(tree.rootIndex).toBe(3);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [7,8,4,5];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete with black parent when a black sibling has an outer red child only", () => {

        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            tree.nodes[0].isRed = false;
            tree.nodes[1].isRed = false;
            tree.nodes[2].isRed = false;
            tree.nodes[3].isRed = true;
            expect(tree.rootIndex).toBe(0);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[1], tree);
            expect(tree.rootIndex).toBe(2);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [7,8,4,3];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete with black parent when a black sibling has 2 red children", () => {
        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            tree.nodes[0].isRed = false;
            tree.nodes[1].isRed = false;
            tree.nodes[2].isRed = false;
            tree.nodes[3].isRed = true;
            tree.nodes[4].isRed = true;
            expect(tree.rootIndex).toBe(0);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[1], tree);
            expect(tree.rootIndex).toBe(2);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [7,8,4,3,5];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete with red parent when a black sibling has an inner red child only", () => {

        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            tree.nodes[0].isRed = true;
            tree.nodes[1].isRed = false;
            tree.nodes[2].isRed = false;
            tree.nodes[3].isRed = true;
            expect(tree.rootIndex).toBe(0);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[1], tree);
            expect(tree.rootIndex).toBe(3);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [7,8,4,5];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete with red parent when a black sibling has an outer red child only", () => {

        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            tree.nodes[0].isRed = true;
            tree.nodes[1].isRed = false;
            tree.nodes[2].isRed = false;
            tree.nodes[3].isRed = true;
            expect(tree.rootIndex).toBe(0);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[1], tree);
            expect(tree.rootIndex).toBe(2);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
            expect(validResult.firstBlackDepth).toBe(beforeValidResult.firstBlackDepth);
        }

        const inOrderValues = [7,8,4,3];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should handle a doubleblack delete replaced with a black child while having a red sibling", () => {
        //add 14 nodes in order, delete the second one
        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            rbt.remove(vals[1], tree);
            let validResult = validateTree(tree);
            expect(validResult.isValid).toBeTruthy();
        }

        const inOrderValues = [];
        for (let index = 0; index < 14; index++) {
            inOrderValues.push(index);
        }

        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should have a history action for each add", () => {
        const tree = makeFromValues([1,2,3]);
        expect(tree.history.actions.length).toBe(3);
    })

    it("should undo and redo 3 adds with a rotation needed", () => {
        const tree = makeFromValues([1,2,3]);
        expect(tree.history.actions.length).toBe(3);
        const rbt = new RedBlackTree(tree);
        rbt.moveHistory(-1);

        
        const actualTest = (vals) => {
            const tree = makeFromValues(vals);
            const rbt = new RedBlackTree(tree);
            let beforeValidResult = validateTree(tree);
            expect(beforeValidResult.isValid).toBeTruthy();
            while(tree.history.currentHistoryAction < tree.history.actions.length){
                rbt.moveHistory(-1);
            }
            rbt.moveHistory(-1);//extra undos to check for bugs
            rbt.moveHistory(-1);
            rbt.moveHistory(-1);
            let fullUndoValidResult = validateTree(tree);
            expect(fullUndoValidResult.isValid).toBeTruthy();
            expect(fullUndoValidResult.firstBlackDepth).toBe(0);
            expect(tree.rootIndex).toBe(-1);
            while(tree.history.currentHistoryAction !== -1){
                rbt.moveHistory(1);
            }
            rbt.moveHistory(1);//extra redos to check for bugs
            rbt.moveHistory(1);
            rbt.moveHistory(1);
            let fullRedoValidResult = validateTree(tree);
            expect(fullRedoValidResult.isValid).toBeTruthy();
            expect(fullRedoValidResult.firstBlackDepth).toBe(2);
            expect(tree.rootIndex).toBe(1);
        }

        const inOrderValues = [1,2,3];
        actualTest(inOrderValues);
        actualTest(makeNegative(inOrderValues));
    })

    it("should set history to a specific spot", () => {
        const tree = makeFromValues([1,2,3,4,5]);
        expect(tree.history.actions.length).toBe(5);
        const rbt = new RedBlackTree(tree);
        rbt.setHistoryToPosition(3,0);
        expect(tree.history.currentHistoryAction).toBe(3);
        expect(tree.history.currentHistoryStep).toBe(0);
    })

    it("should not add history entries when move through history", () => {
        const tree = makeFromValues([1,2,3,4,5]);
        expect(tree.history.actions.length).toBe(5);
        const rbt = new RedBlackTree(tree);
        const beforeCount = getHistoryStepCount(tree);
        rbt.setHistoryToPosition(1,0);
        rbt.setHistoryToPosition(4,3);
        rbt.setHistoryToPosition(-11,0);
        rbt.setHistoryToPosition(5,7);
        const afterCount = getHistoryStepCount(tree);
        expect(beforeCount).toBe(afterCount);
    });

    it("should undo a delete", () => {
        const tree = makeFromValues([1]);
        expect(tree.history.actions.length).toBe(1);
        const rbt = new RedBlackTree(tree);
        rbt.removeIndex(0);
        expect(tree.history.actions.length).toBe(2);
        expect(tree.rootIndex).toBe(-1);
        rbt.setHistoryToPosition(0,0);
        expect(tree.rootIndex).toBe(0);
    });

    it("should undo a delete with 2 children", () => {
        const tree = makeFromValues([2,1,3]);
        expect(tree.history.actions.length).toBe(3);
        const rbt = new RedBlackTree(tree);
        rbt.removeIndex(0);
        expect(tree.history.actions.length).toBe(4);
        expect(tree.nodes[tree.rootIndex].value).toBe(3);
        rbt.setHistoryToPosition(0,0);
        expect(tree.nodes[tree.rootIndex].value).toBe(2);
    });

    it("should redo a delete with 2 children", () => {
        const tree = makeFromValues([2,1,3]);
        expect(tree.history.actions.length).toBe(3);
        const rbt = new RedBlackTree(tree);
        rbt.removeIndex(0);
        expect(tree.history.actions.length).toBe(4);
        expect(tree.nodes[tree.rootIndex].value).toBe(3);
        rbt.setHistoryToPosition(0,0);
        expect(tree.nodes[tree.rootIndex].value).toBe(2);
        rbt.moveHistoryToCurrent();
        expect(tree.nodes[tree.rootIndex].value).toBe(3);
    });

    it("should clear history when created to not keep history", () => {
        const tree = makeFromValues([2,1,3]);
        const rbt = new RedBlackTree(tree);
        rbt.removeIndex(0);
        expect(tree.history.actions.length).toBe(4);
        new RedBlackTree(tree,false);
        expect(tree.history.actions.length).toBe(0);
    });
});

function makeFromValues(vals){
    const tree = RedBlackTree.MakeInitialTree();
    const rbt = new RedBlackTree(tree);
    vals.forEach(x => rbt.add(x))
    return tree
}

function makeNegative(vals){
    const newVals = []
    vals.forEach(x => newVals.push(-x));
    return newVals;
}

function getHistoryStepCount(tree){
    let totalCount = 0;
    tree.history.actions.forEach(h => {
        totalCount += h.steps.length;
    })
    return totalCount;
}


