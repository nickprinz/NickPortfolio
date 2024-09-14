import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../../store/palette";
import SatValComboInput from "./SatValComboInput";

export default function HighInput(){
    const sat = useSelector(paletteSelectors.getHighSat);
    const val = useSelector(paletteSelectors.getHighVal);
    const dispatch = useDispatch();

    const handleSatChange = (sat) => {
        const result = dispatch(paletteActions.setHighSat(sat));
    }

    const handleValChange = (val) => {
        const result = dispatch(paletteActions.setHighVal(val));
    }

    return <>
        <SatValComboInput sat={sat} val={val} onSatChange={handleSatChange} onValChange={handleValChange} />
    </>
}