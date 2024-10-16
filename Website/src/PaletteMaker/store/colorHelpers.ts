import { Color } from "../interfaces/color";
import { ColorCell } from "../interfaces/colorCell";
import { Hsv } from "../interfaces/hsv";


function hsvTo01(hsv: Hsv): Hsv{
    return {h: hsv.h/360,s: hsv.s/100,v: hsv.v/100};
}
function rgbTo01(color: Color): Color{
    return {r: color.r/255,g: color.g/255,b: color.b/255};
}

export function HSVtoRGBHex(hsv: Hsv): string {
    const rgb = HSVZeroOnetoRGB(hsvTo01(hsv));
    return RBGtoHex(rgb);
}

export function HSVtoRGB(hsv: Hsv): Color {
    return HSVZeroOnetoRGB(hsvTo01(hsv))
}

function HSVZeroOnetoRGB(hsv: Hsv) : Color {
    const i = Math.floor(hsv.h * 6);
    const f = hsv.h * 6 - i;
    const p = hsv.v * (1 - hsv.s);
    const q = hsv.v * (1 - f * hsv.s);
    const t = hsv.v * (1 - (1 - f) * hsv.s);
    let r = 0;
    let g = 0;
    let b = 0;
    switch (i % 6) {
        case 0: r = hsv.v, g = t, b = p; break;
        case 1: r = q, g = hsv.v, b = p; break;
        case 2: r = p, g = hsv.v, b = t; break;
        case 3: r = p, g = q, b = hsv.v; break;
        case 4: r = t, g = p, b = hsv.v; break;
        case 5: r = hsv.v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

export function RGBtoHSV(color: Color) : Hsv {
    let result : Hsv = RGBtoHSVZeroOne(color);
    result.h = Math.round(result.h * 360)
    result.s = Math.round(result.s * 100)
    result.v = Math.round(result.v * 100)
    return result;
}

function RGBtoHSVZeroOne (color: Color) : Hsv {
    const rabs = color.r / 255;
    const gabs  = color.g / 255;
    const babs  = color.b / 255;
    const hsv = {h: 0, s: 0, v: Math.max(rabs, gabs, babs)};
    const diff = hsv.v - Math.min(rabs, gabs, babs);
    if (diff == 0) {
        return hsv;
    } 

    const diffc = (c:number) => (hsv.v - c) / 6 / diff + 1 / 2;
    hsv.s = diff / hsv.v;
    const rr = diffc(rabs);
    const gg = diffc(gabs);
    const bb = diffc(babs);

    if (rabs === hsv.v) {
        hsv.h = bb - gg;
    } else if (gabs === hsv.v) {
        hsv.h = (1 / 3) + rr - bb;
    } else if (babs === hsv.v) {
        hsv.h = (2 / 3) + gg - rr;
    }
    if (hsv.h < 0) {
        hsv.h += 1;
    }else if (hsv.h > 1) {
        hsv.h -= 1;
    }

    return hsv;
}

function simpleLum(color: Color): number{
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

function goodLum(color: Color): number{
    const color01 = rgbTo01(color);
    const lin = rgbToLin(color01);
    const y = simpleLum(lin);
    const lStar = ytoLstar(y);
    return lStar;
}

function rgbToLin(color: Color): Color{
    return {r: channeltoLin(color.r), g: channeltoLin(color.g),b: channeltoLin(color.b)};
}

function channeltoLin(colorChannel: number): number {
    // Send this function a decimal sRGB gamma encoded color value
    // between 0.0 and 1.0, and it returns a linearized value.
    if ( colorChannel <= 0.04045 ) {
        return colorChannel / 12.92;
    }
    return Math.pow((( colorChannel + 0.055)/1.055),2.4);
}

function ytoLstar(y: number): number {
    // Send this function a luminance value between 0.0 and 1.0,
    // and it returns L* which is "perceptual lightness"
    if ( y <= (216/24389)) {       // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
        return y * (24389/27);
    }  // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
    return Math.pow(y,(1/3)) * 116 - 16;
}

export function LumFromHsv(hsv: Hsv): number{
    return goodLum(HSVtoRGB(hsv));
}

export function RBGtoHex(color: Color): string{
    return "#" + toHex(color.r) + toHex(color.g) + toHex(color.b);
}

export function ChromaFromHsv(hsv: Hsv): number{
    return Chroma(HSVtoRGB(hsv));
}

function Chroma(color: Color): number{
    //still don't like this, brighter hues are not getting adjusted upward enough
    //the entire upper half is too intense, should be above 70 is too intense and above 50 is getting close
    const lum = goodLum(color);
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    return ((max-min)/2.55)*Math.sqrt(lum/100);
}

function toHex(num: number): string {
    return num.toString(16).padStart(2,"0")
}

export function HexToRGB(hexValue: string): Color{
    if(!hexValue || hexValue.length !== 7){
        return {r:0, g:0, b:0};
    }

    const r = parseInt(hexValue.substring(1,3),16);
    const g = parseInt(hexValue.substring(3,5),16);
    const b = parseInt(hexValue.substring(5,7),16);

    if(isNaN(r) || isNaN(g) || isNaN(b)){
        return {r:0, g:0, b:0};
    }

    return {r, g, b};
}