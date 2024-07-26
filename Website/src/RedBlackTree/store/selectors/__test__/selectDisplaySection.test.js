
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react';
import selectDisplaySection from '../selectDisplaySection';
import BinarySearchTree from '../../SearchTree/BinarySearchTree';
//need to add history tests
describe('red black tree', () => {
    afterEach(() => {
    cleanup();
    });

    it("returns no values when there are no nodes", () => {
        expect(selectDisplaySection(0,[],0,null).length).toBe(0);
    })

    it("returns 3 nodes with lines from the root", () => {
        const nodes = [
            makeNode(0,-1,"5",false),
        ];
        const positioners = selectDisplaySection(0,nodes,0,null);
        expect(positioners.length).toBe(3);
        expect(positioners[0].linesTo.length).toBe(2);
        expect(positioners[1].linesTo).toBeUndefined();
        expect(positioners[2].linesTo).toBeUndefined();
        expect(positioners[0].value).toBe("5");
        expect(positioners[1].value).toBeNull();
        expect(positioners[2].value).toBeNull();
    })

    it("returns 7 nodes with lines to children and nulls", () => {
        const nodes = [
            makeNode(0,-1,"5",false,1,2,),
            makeNode(0,0,"6",true),
            makeNode(0,0,"7",false),
        ];
        const positioners = selectDisplaySection(0,nodes,0,null);
        expect(positioners.length).toBe(7);
        expect(positioners[0].linesTo.length).toBe(2);
        expect(positioners[1].linesTo.length).toBe(2);
        expect(positioners[4].linesTo.length).toBe(2);
        expect(positioners[0].value).toBe("5");
        expect(positioners[1].value).toBe("6");
        expect(positioners[4].value).toBe("7");
    })
})

const makeCompareStep = (primaryIndex, secondaryIndex) => {
    return {
        type: BinarySearchTree.COMPARE,
        primaryIndex: primaryIndex,
        secondaryIndex: secondaryIndex,
    }
}

const makeParentStep = (index, parentIndex) => {

}

const makeNode = (index, parent, value, isRed, left=-1, right=-1, childCount=1, depthBelow=1) => {
    return {
        index:index,
        id:index,
        parent: parent,
        left: left,
        right: right,
        value: value,
        isRed: isRed,
        childCount: childCount,
        depthBelow: depthBelow,
    }
}