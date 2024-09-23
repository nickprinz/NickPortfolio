import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../../store/palette";
import { useTranslation } from "react-i18next";
import AdjustmentsInput from "./AdjustmentsInput";

export default function CellAdjustmentsInput(){
    const hsv = useSelector(paletteSelectors.getActiveCellAdjustments);
    //need to get adjustments
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("palette");

    const isSelected = !(!hsv);

    const handleHueChange = (hue) => {
        const result = dispatch(paletteActions.setActiveCellAdjustments({h:hue, s:hsv.s, v: hsv.v}));
    }

    const handleSatChange = (sat) => {
        const result = dispatch(paletteActions.setActiveCellAdjustments({h:hsv.h, s:sat, v: hsv.v}));
    }

    const handleValChange = (val) => {
        const result = dispatch(paletteActions.setActiveCellAdjustments({h:hsv.h, s:hsv.s, v: val}));
    }

    return <>
    <AdjustmentsInput hue={hsv?.h} sat={hsv?.s} val={hsv?.v}
        onHueChange={handleHueChange} onSatChange={handleSatChange} onValChange={handleValChange} disabled={!isSelected}/>
    </>
}