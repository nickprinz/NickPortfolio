import { PaletteValue } from "../interfaces/paletteValue";

export class PaletteCell{

    protected value: PaletteValue;
    constructor(value: PaletteValue){
        this.value = value;
    }

    public getValue(): PaletteValue{
        return {...this.value};
    }
}