import { useTranslation } from "react-i18next";
import NumberInput from "./NumberInput";
import PointDownArrow from "./PointDownArrow";

export default function SatValComboInput({sat, val, onSatChange, onValChange}){
    const { t: translate } = useTranslation("palette");

    return <>
    <div className="flex flex-col items-center">
        <NumberInput onValueChange={onSatChange} labelText={translate("sat")} value={sat} max={100}></NumberInput>
        <NumberInput onValueChange={onValChange} labelText={translate("val")} value={val} max={100}></NumberInput>
        <PointDownArrow/>
    </div>
    </>
}