import RedBlackTree from './RedBlackTree';
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react';


describe('red black tree', () => {
    afterEach(() => {
    cleanup();
    });

    it("should have no root when init", () => {
        const tree = new RedBlackTree();
        
        expect(tree.root).toBeNull();
    })

    it("should add a root", () => {
        const tree = new RedBlackTree();
        tree.add(10)
        
        expect(tree.root.value).toBe(10);
    })

    it("should nodes on each side", () => {
        const tree = new RedBlackTree();
        tree.add(10);
        tree.add(5);
        tree.add(6);
        tree.add(7);
        tree.add(2);
        tree.add(12);
        
        expect(tree.root.value).toBe(10);

        const l1 = tree.getFromIndex(tree.root.left);
        expect(l1.value).toBe(5);
        expect(l1.parent).toBe(tree.root.index);

        const l2 = tree.getFromIndex(l1.left);
        expect(l2.value).toBe(2);
        expect(l2.left).toBe(-1);
        expect(l2.right).toBe(-1);
        expect(l2.parent).toBe(l1.index);

        const l1r1 = tree.getFromIndex(l1.right);
        expect(l1r1.value).toBe(6);
        expect(l1r1.left).toBe(-1);
        expect(l1r1.parent).toBe(l1.index);

        const l1r2 = tree.getFromIndex(l1r1.right);
        expect(l1r2.value).toBe(7);
        expect(l1r2.left).toBe(-1);
        expect(l1r2.right).toBe(-1);
        expect(l1r2.parent).toBe(l1r1.index);

        expect(tree.count()).toBe(6);
    })
});
