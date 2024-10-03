

export const wrap = ( num: number, max: number): number => {
    let result = num;
    while(result > max){
        result = result - max;
    }
    while(result < 0){
        result = result + max;
    }
    
    return result
}

export const lerp = (a: number, b: number, t: number ): number => {
    return a + t * ( b - a );
}

export const safeInLerp = (a: number, b: number, value: number): number => {
    if (a === b) {
        return 0; // Avoid division by zero
    }
    return (value - a) / (b - a);
}

export const inLerp = (a: number, b: number, value: number): number => {
    return (value - a) / (b - a);
}