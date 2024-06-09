import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react';
import { makeInitialTreeState } from './tree';
import { add as treeAdd, remove as treeRemove, removeIndex as treeRemoveIndex } from './treeHelper';

describe('red black tree', () => {
    afterEach(() => {
    cleanup();
    });

    it("should have no root when init", () => {
        const tree = makeInitialTreeState();
        
        expect(tree.rootIndex).toBe(-1);
    })

    it("should add a root", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        
        expect(tree.nodes[tree.rootIndex].value).toBe(10);
    })

    it("should nodes on each side", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        treeAdd(5, tree);
        treeAdd(12, tree);
        
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
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        
        expect(tree.nodes[tree.rootIndex].value).toBe(10);
        treeRemove(10, tree);
        expect(tree.rootIndex).toBe(-1);
    })

    it("should remove node with 2 children", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        treeAdd(5, tree);
        treeAdd(15, tree);
        treeAdd(7, tree);
        treeAdd(2, tree);
        
        treeRemoveIndex(1, tree);
        const r = tree.nodes[tree.rootIndex];
        const l1 = tree.nodes[r.left];
        expect(l1.value).toBe(7);
        expect(l1.right).toBe(-1);
        expect(l1.left).not.toBe(-1);
    })
});


