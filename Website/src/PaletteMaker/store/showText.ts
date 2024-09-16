

export enum ShowText{
    None = "none",
    Lum = "lum",
    Hue = "hue",
}

export function GetAllShowTextOptions(){
    const stringKeys = Object
    .keys(ShowText)
    .filter((v) => isNaN(Number(v)))

    return stringKeys;
}