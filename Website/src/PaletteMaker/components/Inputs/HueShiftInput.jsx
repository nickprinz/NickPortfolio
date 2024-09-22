import { useDispatch, useSelector } from "react-redux";
import NumberInput from "./NumberInput";
import { paletteActions, paletteSelectors } from "../../store/palette";
import { useTranslation } from "react-i18next";

export default function HueShiftInput(){
    const rowCount = useSelector(paletteSelectors.getHueShift);
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("palette");

    const handleRowsChange = (rowCount) => {
        const result = dispatch(paletteActions.setHueShift(rowCount));
    }

    return <>
        <NumberInput onValueChange={handleRowsChange} labelText={translate("hue_shift")} value={rowCount} min={-359} max={359}></NumberInput>
    </>
}