import { Hsv } from "../interfaces/hsv";

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

export const fillDirections = (directions:boolean[], newCount:number):boolean[] => {
    if(newCount === directions.length) return directions;
    if(newCount < directions.length){
        return directions.slice(0,newCount);
    }
    return directions.concat(makeDirections(newCount - directions.length));
}

const makeBlankGrid = (rows: number, columns):Hsv[][] => {
    const b: Hsv[][] = [];
    for (let index = 0; index < rows; index++) {
        b.push(makeBlanks(columns));
    }
    return b;
}

const makeBlanks = (count: number):Hsv[] => {
    const b: Hsv[] = [];
    for (let index = 0; index < count; index++) {
        b.push(makeBlank());
    }
    return b;
}

const makeBlank = ():Hsv => {
    return {h:0, s:0, v:0}
}

const makeDirections = (count: number):boolean[] => {
    const b: boolean[] = [];
    for (let index = 0; index < count; index++) {
        b.push(true);
    }
    return b;
}