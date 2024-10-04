
import NumberInput from "../BasicInput/NumberInput";
import { useTranslation } from "react-i18next";

export default function AdjustmentsInput({hsv, onHueChange, onSatChange, onValChange, disabled= false}){
    //need to get adjustments
    const { t: translate } = useTranslation("palette");

    return <>
    <div className="flex flex-row items-center">
        <NumberInput onValueChange={onHueChange} labelText={translate("hue")} value={hsv?.h || ""} min={-360} max={360} disabled={disabled}></NumberInput>
        <NumberInput onValueChange={onSatChange} labelText={translate("sat")} value={hsv?.s || ""} min={-100} max={100} disabled={disabled}></NumberInput>
        <NumberInput onValueChange={onValChange} labelText={translate("val")} value={hsv?.v || ""} min={-100} max={100} disabled={disabled}></NumberInput>
    </div>
    </>
}