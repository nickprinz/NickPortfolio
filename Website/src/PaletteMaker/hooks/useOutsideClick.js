import { useEffect, useRef, useState } from "react";

export function useOutsideClick(callback) {
    const selfRef = useRef();
  
    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === 'Escape') {
            callback();
          }
        };
        const handleClickOutside = (event) => {
          if (selfRef.current && !selfRef.current.contains(event.target)) {
            callback();
          }
        };
      
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClickOutside);
      
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('click', handleClickOutside);
        };
      }, [callback]);

    return selfRef;
}

// export function useDistibuted() {
//     const [isDistributing, setIsDistributing] = useState(false);
//     const [count, setCount] = useState(0);
    
//     const beginDistributing = async (distributedFn, iterations = 1, delay = 1, initialDelay = 1) => {
//         if(isDistributing){
//             throw new Error("can't distribute when already distributing");
//         }
//         setIsDistributing(true);
//         setCount(0);

//     };

//     return [isDistributing, count, beginDistributing];
// }