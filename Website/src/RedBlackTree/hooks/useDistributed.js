import { useEffect, useState, useCallback } from "react";
import { pTimeout } from "../../Shared/utility";

export function useDistibuted() {
    const [isDistributing, setIsDistributing] = useState(false);
    const [count, setCount] = useState(0);

    const beginDistributing = async (distributedFn, iterations = 1, delay = 1) => {
        if(isDistributing){
            throw new Error("can't distribute when already distributing");
        }
        setIsDistributing(true);
        setCount(0);
        await pTimeout(() => {}, delay);
        for (let index = 0; index < iterations; index++) {
            distributedFn(index);
            setCount(index + 1);
            await pTimeout(() => {}, delay);
        }

        await pTimeout(() => {setIsDistributing(false)}, delay);

    };

    return [isDistributing, count, beginDistributing];
}

