import NumberInput from "./NumberInput";
import PointDownArrow from "./PointDownArrow";

export default function SatValComboInput({sat, val, onSatChange, onValChange}){

    return <>
    <div className="flex flex-col items-center">
        <NumberInput onValueChange={onSatChange} labelText={"sat"} value={sat} max={100}></NumberInput>
        <NumberInput onValueChange={onValChange} labelText={"val"} value={val} max={100}></NumberInput>
        <PointDownArrow/>
    </div>
    </>
}