import LineBetween, {getLine} from "./LineBetween";
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react';


//let mockGet = vi.fn().mockImplementation(getLine);

describe('lines', () => {
    afterEach(() => {
    cleanup();
    });

    it("should render straight line", () => {
        const testLine = {xPos:0, yPos: 10, rotate:0, width: 20};
        const lineSpy = vi.fn(() => testLine);
      
        const doc = render(<LineBetween lineFn={lineSpy} />);
        const line = doc.getByRole("separator");
        
        expect(line.style.transform).toBe('rotate(0deg)');
        expect(line.style.top).toBe('10px');
        expect(line.style.left).toBe('0px');
        expect(line.style.width).toBe('20px');
        
    })

    it("should render 10 degree line", () => {
        const testLine = {xPos:-5, yPos: 0, rotate:10, width: 10};
        const lineSpy = vi.fn(() => testLine);
      
        const doc = render(<LineBetween lineFn={lineSpy} />);
        const line = doc.getByRole("separator");
        
        expect(line.style.transform).toBe('rotate(10deg)');
        expect(line.style.top).toBe('0px');
        expect(line.style.left).toBe('-5px');
        expect(line.style.width).toBe('10px');
    })
});

describe("getLine", () => {
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

