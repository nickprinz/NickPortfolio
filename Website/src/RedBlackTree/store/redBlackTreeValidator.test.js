import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react';
import validateTree from "./redBlackTreeValidator";
import RedBlackTree from './RedBlackTree';

describe('red black tree', () => {
    afterEach(() => {
    cleanup();
    });


    it("should find red-red violation", () => {
        const tree = makeFromValues([10,5,15]);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[0].isRed = true;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();

    })


    it("should find black depth violation", () => {
        const tree = makeFromValues([10,5,15]);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[1].isRed = false;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();

    })


    it("should not allow left child to be more than parent", () => {
        const tree = makeFromValues([10,5,15]);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[1].value = 12;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();

    })

    it("should not allow left child to be more than grandparent", () => {
        const tree = makeFromValues([10,5,15,7]);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[3].value = 12;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();
    })

    it("should detect children with the wrong parent listed", () => {
        const tree = makeFromValues([10,5,15,7]);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[3].parent = 0;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();
    })
});


function makeFromValues(vals){
    const tree = RedBlackTree.MakeInitialTree();
    const rbt = new RedBlackTree(tree);
    vals.forEach(x => rbt.add(x))
    return tree
}

