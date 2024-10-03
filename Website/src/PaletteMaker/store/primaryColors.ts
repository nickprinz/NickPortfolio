

export enum PrimaryColors{
    RGB = "rgb",
    RYB = "ryb",
}

export function GetAllPrimaryColorOptions(){
    const stringKeys = Object
    .keys(PrimaryColors)
    .filter((v) => isNaN(Number(v)))

    return stringKeys;
}