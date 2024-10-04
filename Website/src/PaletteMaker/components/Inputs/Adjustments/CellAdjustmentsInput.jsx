import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../../../store/palette";
import { useTranslation } from "react-i18next";
import AdjustmentsInput from "./AdjustmentsInput";

export default function CellAdjustmentsInput(){
    const hsv = useSelector(paletteSelectors.getActiveCellAdjustments);
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("palette");

    const isSelected = !(!hsv);

    const handleHueChange = (hue) => {
        dispatch(paletteActions.setActiveCellAdjustments({...hsv, h:hue}));
    }

    const handleSatChange = (sat) => {
        dispatch(paletteActions.setActiveCellAdjustments({...hsv, s:sat}));
    }

    const handleValChange = (val) => {
        dispatch(paletteActions.setActiveCellAdjustments({...hsv, v:val}));
    }

    return <>
    <AdjustmentsInput hsv={hsv}
        onHueChange={handleHueChange} onSatChange={handleSatChange} onValChange={handleValChange} disabled={!isSelected}/>
    </>
}