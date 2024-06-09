import MenuButton from "./MenuButton";
import { useRef } from "react";

export default function FieldButton({onClick, children}){
    const inputRef = useRef();
    return <>
        <div className={"contents"}>
            <input type="number" min="0" max="99999999" ref={inputRef}></input>
            <MenuButton onClick={() => {
                onClick( Math.round(inputRef.current.value));
                inputRef.current.value = "";
                }}>
                {children}
            </MenuButton>
        </div>
    </>
}