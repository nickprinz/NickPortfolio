import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react';
import { add as treeAdd, remove as treeRemove, removeIndex as treeRemoveIndex, makeInitialTreeState } from './treeHelper';
//fix this to just be an interface test
//need to find a way to inject RedBlackTree so a mocked class can be tested instead
describe('tree helper', () => {
    afterEach(() => {
    cleanup();
    });

    it("should add", () => {
        const tree = makeInitialTreeState();
        treeAdd(10, tree);
        
        expect(tree.nodes[tree.rootIndex].value).toBe(10);
    })
});


