import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react';
import { makeInitialTreeState } from './tree';
import { add as treeAdd, remove as treeRemove, removeIndex as treeRemoveIndex } from './treeHelper';
import validateTree from "./redBlackTreeValidator";

describe('red black tree', () => {
    afterEach(() => {
    cleanup();
    });


    it("should find red-red violation", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        treeAdd(5, tree);
        treeAdd(15, tree);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[0].isRed = true;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();

    })


    it("should find black depth violation", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        treeAdd(5, tree);
        treeAdd(15, tree);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[1].isRed = false;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();

    })


    it("should not allow left child to be more than parent", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        treeAdd(5, tree);
        treeAdd(15, tree);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[1].value = 12;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();

    })

    it("should not allow left child to be more than grandparent", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        treeAdd(5, tree);
        treeAdd(15, tree);
        treeAdd(7, tree);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[3].value = 12;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();
    })

    it("should detect children with the wrong parent listed", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        treeAdd(5, tree);
        treeAdd(15, tree);
        treeAdd(7, tree);

        let validResult = validateTree(tree);
        expect(validResult.isValid).toBeTruthy();

        tree.nodes[3].parent = 0;
        let invalidResult = validateTree(tree);
        expect(invalidResult.isValid).toBeFalsy();
    })
});


