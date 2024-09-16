import { useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";


export default function Dropdown({label, selectedValue, choices, onSelect}){
    const [isOpen, setIsOpen] = useState(false);

    const handleOutsideClick = () => {
        setIsOpen(false);
    }
    const selfRef = useOutsideClick(handleOutsideClick);

    const handleClickMain = () => {
        setIsOpen((oldState) => {
            return !oldState;
        });
    }

    const handleChoiceClick = (v) => {
        setIsOpen(false);
        if(onSelect){
            onSelect(v);
        }
    }

    const selectedIndex = choices?.find(x => x.value === selectedValue);
    const displayText = selectedIndex?.text || "";

    return <>
        <div className="p-1 flex flex-col">
            <label className="px-2">{label}</label>
            <div ref={selfRef} className="relative">
                <div onClick={handleClickMain} className="px-2 py-0 h-7 bg-slate-200 hover:bg-white border-black border-2 cursor-pointer rounded-md">
                    {displayText}
                </div>
                {isOpen && <div className="bg-slate-200 border-black border-2 cursor-pointer rounded-md absolute w-full">
                    {choices.map(x => {
                        return <div className="hover:bg-white px-2  border-b-2 border-slate-500" key={x.value} onClick={() => {handleChoiceClick(x.value)}}>{x.text}</div>
                    })}
                    
                </div>}
            </div>
        </div>
    </>
}