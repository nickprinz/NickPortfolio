import { HexToRGB } from "../store/colorHelpers";

export default function ColorInput({onValueChange, labelText, value}){
    const handleChange = (e) =>{
        let hexColor = HexToRGB(e.target.value);
        onValueChange(hexColor);
    }

    return <>
        <div className={"flex flex-col bg-slate-500 rounded-lg m-4 py-2 border-slate-600 border-b-4"}>
            <label className="text-center font-semibold">{labelText}</label>
            <input value={value} type="color" className=" w-60 h-8 mx-2 my-1 py-0  text-right" onChange={handleChange}></input>
        </div>
    </>
}