import LineBetween from "./LineBetween";
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react';
import getLine from "./getLineFromPoints";

vi.mock("./getLineFromPoints");

describe('lines', () => {
    afterEach(() => {
        cleanup();
    });
    
    beforeEach(async () => {
        vi.clearAllMocks();
    })

    it("should render straight line", async () => {
        vi.useFakeTimers();
        const testLine = {xPos:0, yPos: 10, rotate:0, width: 20};
        getLine.mockImplementation(() => testLine);
        const doc = render(<LineBetween fromPoint={{x:0, y:10}}  duration={0} delay={0} />);

        const line = doc.getByRole("separator");
        expect(line.style.transform).toContain('rotate(0deg)');
        expect(line.style.transform).toContain('scale(0)');
        expect(line.style.transform).toContain('translateX(0px)');
        expect(line.style.transform).toContain('translateY(10px)');

        await vi.waitFor(
            () => {
              if (!line.style.transform.includes("scale(1)")) {
                throw new Error('scaling slow')
              }
            },
            {
              timeout: 100,
              interval: 10,
            }
          )
        
        expect(line.style.transform).toContain('rotate(0deg)');
        expect(line.style.transform).toContain('scale(1)');
        expect(line.style.transform).toContain('translateX(0px)');
        expect(line.style.transform).toContain('translateY(10px)');
        expect(line.style.width).toBe('20px');
        
    })

    it("should render 10 degree line", async () => {
        const testLine = {xPos:-5, yPos: 0, rotate:10, width: 10};
        getLine.mockImplementation(() => testLine);
      
        const doc = render(<LineBetween fromPoint={{x:-5, y:0}} duration={0} delay={0} />);
        const line = doc.getByRole("separator");
        
        await vi.waitFor(
            () => {
              if (!line.style.transform.includes("scale(1)")) {
                throw new Error('scaling slow')
              }
            },
            {
              timeout: 100,
              interval: 10,
            }
          )
        
        
        expect(line.style.transform).toContain('rotate(10deg)');
        expect(line.style.transform).toContain('translateX(-5px)');
        expect(line.style.transform).toContain('translateY(0px)');
        expect(line.style.width).toBe('10px');
    })
});



