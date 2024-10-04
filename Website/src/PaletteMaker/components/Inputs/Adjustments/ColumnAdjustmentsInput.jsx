import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../../../store/palette";
import { useTranslation } from "react-i18next";
import AdjustmentsInput from "./AdjustmentsInput";

export default function ColumnAdjustmentsInput(){
    const hsv = useSelector(paletteSelectors.getActiveColumnAdjustments);
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("palette");

    const isSelected = !(!hsv);

    const handleHueChange = (hue) => {
        dispatch(paletteActions.setActiveColumnAdjustments({...hsv, h:hue}));
    }

    const handleSatChange = (sat) => {
        dispatch(paletteActions.setActiveColumnAdjustments({...hsv, s:sat}));
    }

    const handleValChange = (val) => {
        dispatch(paletteActions.setActiveColumnAdjustments({...hsv, v:val}));
    }

    return <>
    <AdjustmentsInput hsv={hsv}
        onHueChange={handleHueChange} onSatChange={handleSatChange} onValChange={handleValChange} disabled={!isSelected}/>
    </>
}