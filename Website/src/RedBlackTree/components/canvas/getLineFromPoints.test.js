
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react';
import getLine from "./getLineFromPoints";

describe("getLineFromPoints", () => {
    afterEach(() => {
    cleanup();
    });

    it("should give horizontal line", () => {

        const line = getLine({x:1, y:2}, {x:11, y:2});
        
        expect(line.xPos).toBeCloseTo(1);
        expect(line.yPos).toBeCloseTo(2);
        expect(line.width).toBeCloseTo(10);
        expect(line.rotate).toBeCloseTo(0);
    })

    const angle53 = 53.13;
    const radian53 = 0.93;
    it("should give 5 from 3-4-5 triangle", () => {

        const line = getLine({x:0, y:0}, {x:3, y:4});

        let adjustment = (1 - Math.cos(radian53))*5/2;
        
        expect(line.xPos).toBeCloseTo(-adjustment, 1);
        expect(line.yPos).toBeCloseTo(2);
        expect(line.width).toBeCloseTo(5);
        expect(line.rotate).toBeCloseTo(angle53, 2);
    })
})