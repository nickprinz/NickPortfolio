import { Color } from "../interfaces/color";
import { Hsv } from "../interfaces/hsv";


function hsvTo01(hsv: Hsv): Hsv{
    return {h: hsv.h/360,s: hsv.s/100,v: hsv.v/100};
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

export function Lum(color: Color): number{
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

export function RBGtoHex(color: Color): string{
    return "#" + toHex(color.r) + toHex(color.g) + toHex(color.b);
}

function toHex(num: number): string {
    return num.toString(16).padStart(2,"0")
}