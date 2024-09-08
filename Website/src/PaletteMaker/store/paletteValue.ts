export interface Color{
    r: number,
    g: number,
    b: number,
}

export interface Hsv{
    h: number,
    s: number,
    v: number,
}

export interface PaletteValue extends Color{
    hueAdjust: number,
    satAdjust: number,
    valAdjust: number,
}

export class PaletteCell{
    constructor(value: PaletteValue){
        
    }
}

//i need a class that can recalculate values but also a raw js object that can be stored in redux properly
//I can have an interface for the base amount of info needed and a class that takes in this object as a constructor