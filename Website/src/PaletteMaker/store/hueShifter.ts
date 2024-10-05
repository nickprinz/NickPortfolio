//red: 0, orange: 30, yellow: 60, green: 120, blue: 240, purple: 300, red: 360
//red: 0, orange: 60, yellow: 120, green: 180, blue: 240, purple: 300, red: 360

import { inLerp, lerp, wrap } from "./mathHelpers";

const hueRamp = [0, 26, 54, 120, 240, 310, 360];
const nhueRamp = [0, 60, 120, 180, 240, 300, 360];

export function toNHue(hue: number): number{
    hue = wrap(hue,360);
    //if given 45, it should return 90
    //will see 45 is between 30 and 60 with a t of .5
    //the equivalent indexed entries are 60 and 120, given a t of .5 will return 90
    return convertWithRamp(hue, hueRamp, nhueRamp);
}

export function fromNHue(nhue: number): number{
    nhue = wrap(nhue,360);
    return convertWithRamp(nhue, nhueRamp, hueRamp);
}

function convertWithRamp(num: number, startRamp: number[], endRamp: number[]): number{
    if(startRamp.length !== endRamp.length){
        throw new Error("uneven ramp lengths")
    }

    const upperIndex = getUpperIndex(num, startRamp);
    const t = inLerp(startRamp[upperIndex-1], startRamp[upperIndex], num);
    return lerp(endRamp[upperIndex-1], endRamp[upperIndex], t);
}

function getUpperIndex(num: number, startRamp:  number[]): number {
    let upperIndex = -1;
    for (let i = 1; i < startRamp.length; i++) {
        const possibleUpper = startRamp[i];
        const possibleLower = startRamp[i-1];
        if(possibleUpper >= num && possibleLower <= num){
            upperIndex = i;
            break;
        }
    }
    if(upperIndex <= 0){
        throw new Error(`could not find between values for ${num}`)
    }
    return upperIndex;
}