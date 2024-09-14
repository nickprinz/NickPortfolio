import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../../store/palette";
import SatValComboInput from "./SatValComboInput";

export default function LowInput(){
    const sat = useSelector(paletteSelectors.getLowSat);
    const val = useSelector(paletteSelectors.getLowVal);
    const dispatch = useDispatch();

    const handleSatChange = (sat) => {
        const result = dispatch(paletteActions.setLowSat(sat));
    }

    const handleValChange = (val) => {
        const result = dispatch(paletteActions.setLowVal(val));
    }

    return <>
        <SatValComboInput sat={sat} val={val} onSatChange={handleSatChange} onValChange={handleValChange} />
    </>
}