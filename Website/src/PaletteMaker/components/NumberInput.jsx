
import { useRef } from "react";

export default function NumberInput({onValueChange, labelText, value}){
    const inputRef = useRef();
    const handleChange = (e) =>{
        onValueChange( Math.round(inputRef.current.value));
    }

    return <>
        <div className={"contents"}>
            <label>{labelText}</label>
            <input value={value} className="px-2 mx-3 text-right" type="number" min="0" max="100" ref={inputRef} onChange={handleChange}></input>
        </div>
    </>
}