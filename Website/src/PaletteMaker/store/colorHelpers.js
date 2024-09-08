
export function HSVtoRGBHex(h, s, v) {
    const rgb = HSVZeroOnetoRGB(h/360,s/100,v/100);
    return RBGtoHex(rgb.r, rgb.g, rgb.b);
}

export function HSVtoRGB(h, s, v) {
    return HSVZeroOnetoRGB(h/360,s/100,v/100)
}

export function HSVZeroOnetoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

export function RGBtoHSV(r, g, b) {
    let result = RGBtoHSVZeroOne(r,g,b);
    result.h = Math.round(result.h * 360)
    result.s = Math.round(result.s * 100)
    result.v = Math.round(result.v * 100)
    return RGBtoHSVZeroOne(r,g,b)
}

function RGBtoHSVZeroOne (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: h,
        s: s,
        v: v
    };
}

export function Lum(r,g,b){
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function RBGtoHex(r,g,b){
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function toHex(num) {
    return num.toString(16).padStart(2,"0")
}