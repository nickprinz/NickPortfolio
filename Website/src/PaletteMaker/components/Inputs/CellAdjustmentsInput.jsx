import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../../store/palette";
import NumberInput from "./NumberInput";
import { useTranslation } from "react-i18next";

export default function CellAdjustmentsInput(){
    const hsv = useSelector(paletteSelectors.getActiveCellAdjustments);
    //need to get adjustments
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("palette");

    const isSelected = !(!hsv);

    const handleHueChange = (hue) => {
        //need to set adjustments
        const result = dispatch(paletteActions.setActiveCellAdjustments({h:hue, s:hsv.s, v: hsv.v}));
    }

    const handleSatChange = (sat) => {
        //need to set adjustments
        //const result = dispatch(paletteActions.setLowSat(sat));
        const result = dispatch(paletteActions.setActiveCellAdjustments({h:hsv.h, s:sat, v: hsv.v}));
    }

    const handleValChange = (val) => {
        //const result = dispatch(paletteActions.setLowVal(val));
        const result = dispatch(paletteActions.setActiveCellAdjustments({h:hsv.h, s:hsv.s, v: val}));
    }

    return <>
    <div className="flex flex-row items-center">
        <NumberInput onValueChange={handleHueChange} labelText={translate("hue")} value={hsv?.h || ""} min={-360} max={360} disabled={!isSelected}></NumberInput>
        <NumberInput onValueChange={handleSatChange} labelText={translate("sat")} value={hsv?.s || ""} min={-100} max={100} disabled={!isSelected}></NumberInput>
        <NumberInput onValueChange={handleValChange} labelText={translate("val")} value={hsv?.v || ""} min={-100} max={100} disabled={!isSelected}></NumberInput>
    </div>
    </>
}