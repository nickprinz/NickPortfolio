import RedBlackTree from './RedBlackTree';
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react';


describe('red black tree', () => {
    afterEach(() => {
    cleanup();
    });

    it("should have no root when init", () => {
        const tree = new RedBlackTree();
        
        expect(tree.getRoot()).toBeNull();
    })

    it("should add a root", () => {
        const tree = new RedBlackTree();
        tree.add(10)
        
        expect(tree.getRoot().value).toBe(10);
    })

    it("should nodes on each side", () => {
        const tree = new RedBlackTree();
        tree.add(10);
        tree.add(5);
        tree.add(12);
        
        const r = tree.getRoot();
        expect(r.value).toBe(10);

        const l1 = tree.getFromIndex(r.left);
        expect(l1.value).toBe(5);
        expect(l1.parent).toBe(r.index);
        expect(l1.left).toBe(-1);
        expect(l1.right).toBe(-1);

        const r1 = tree.getFromIndex(r.right);
        expect(r1.value).toBe(12);
        expect(r1.parent).toBe(r.index);
        expect(r1.left).toBe(-1);
        expect(r1.right).toBe(-1);

        expect(tree.count()).toBe(3);
    })

    it("should return immutable values", () => {
        const tree = new RedBlackTree();
        tree.add(10)
        const r = tree.getRoot();
        r.right = 3;
        const r2 = tree.getRoot();
        
        expect(r2.right).toBe(-1);
    })

    it("should add and remove root", () => {
        const tree = new RedBlackTree();
        tree.add(10)
        
        expect(tree.getRoot().value).toBe(10);
        tree.remove(10);
        expect(tree.getRoot()).toBeFalsy();
    })

    it("should remove node with 2 children", () => {
        const tree = new RedBlackTree();
        tree.add(10);
        tree.add(5);
        tree.add(15);
        tree.add(7);
        tree.add(2);
        
        tree.remove(5);
        const l1 = tree.getFromIndex(tree.getRoot().left);
        expect(l1.value).toBe(7);
        expect(l1.right).toBe(-1);
        expect(l1.left).not.toBe(-1);
    })
});
