import { useOutsideClick } from "../../hooks/useOutsideClick";


export default function Dropdown({label, selectedValue, choices, onSelect}){
    const handleOutsideClick = () => {
        console.log("outside");
    }
    const selfRef = useOutsideClick(handleOutsideClick);

    //choices are {value: a, text: "a"}

    return <>
        <div className="p-1">
            <label>{label}</label>
            <div ref={selfRef} className="px-2 py-0 bg-slate-100 hover:bg-white border-black border-2 cursor-pointer rounded-md">
                some text
            </div>
        </div>
    </>
}