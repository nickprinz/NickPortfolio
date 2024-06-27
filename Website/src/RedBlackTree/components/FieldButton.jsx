import MenuButton from "./MenuButton";
import { useRef } from "react";

export default function FieldButton({onClick, children}){
    const inputRef = useRef();
    const onKeyDown = (e) =>{
        if (e.key === "Enter") valueEntered();
    }
    const valueEntered = () => {
        onClick( Math.round(inputRef.current.value));
        inputRef.current.value = "";
    }

    return <>
        <div className={"contents"}>
            <input className="-mr-1" type="number" min="-9999999" max="99999999" ref={inputRef} onKeyDown={onKeyDown}></input>
            <MenuButton onClick={() => valueEntered()}>
                {children}
            </MenuButton>
        </div>
    </>
}