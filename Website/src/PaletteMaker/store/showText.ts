

export enum ShowText{
    None = "none",
    Lum = "lum",
    Hue = "hue",
    Sat = "sat",
    Val = "val",
    Adjust = "adjustments",
}

export function GetAllShowTextOptions(){
    const stringKeys = Object
    .keys(ShowText)
    .filter((v) => isNaN(Number(v)))

    return stringKeys;
}