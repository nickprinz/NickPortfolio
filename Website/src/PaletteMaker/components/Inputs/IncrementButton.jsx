import { useRef } from "react";

export default function IncrementButton({onValueChange, amount = 1}){
    const intervalRef = useRef();
    const onChangeRef = useRef();
    onChangeRef.current = onValueChange;
    
    const startPress = () => {
        onValueChange(amount);
        const inter = setInterval(() => {
            onChangeRef.current(amount);
        }, 200);
        intervalRef.current = inter;
    }

    const stopPress = () => {
        clearInterval(intervalRef.current);
    }

    const buttonText = amount > 0 ? "+" : "-";
    return <button className="hover:bg-slate-400 rounded-md size-8"  onPointerDown={startPress} onPointerUp={stopPress}>{buttonText}</button>
}