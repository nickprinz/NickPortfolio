import { Hsv } from "../interfaces/hsv";

export const makeBlank = ():Hsv => {
    return {h:0, s:0, v:0}
}

export const makeBlanks = (count: number):Hsv[] => {
    const b: Hsv[] = [];
    for (let index = 0; index < count; index++) {
        b.push(makeBlank());
    }
    return b;
}

export const makeBlankGrid = (rows: number, columns):Hsv[][] => {
    const b: Hsv[][] = [];
    for (let index = 0; index < rows; index++) {
        b.push(makeBlanks(columns));
    }
    return b;
}

export const fillAdjustments = (adjustments:Hsv[], newCount:number):Hsv[] => {
    if(newCount === adjustments.length) return adjustments;
    if(newCount < adjustments.length){
        return adjustments.slice(0,newCount);
    }
    return adjustments.concat(makeBlanks(newCount - adjustments.length));
}

export const fillGridRowAdjustments = (adjustments:Hsv[][], newRowCount:number, currentColumnCount: number):Hsv[][] => {
    if(newRowCount === adjustments.length){
        return adjustments;
    }
    if(newRowCount < adjustments.length){
        return adjustments.slice(0,newRowCount);
    }
    return adjustments.concat(makeBlankGrid(newRowCount - adjustments.length, currentColumnCount));
}

export const fillGridColumnAdjustments = (adjustments:Hsv[][], newColumnCount:number):Hsv[][] => {
    if(adjustments.length === 0 || newColumnCount === adjustments[0].length){
        return adjustments;
    }
    return adjustments.map(row => fillAdjustments(row,newColumnCount));
}