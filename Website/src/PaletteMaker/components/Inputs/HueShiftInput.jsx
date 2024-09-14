import { useDispatch, useSelector } from "react-redux";
import NumberInput from "./NumberInput";
import { paletteActions, paletteSelectors } from "../../store/palette";

export default function HueShiftInput(){
    const rowCount = useSelector(paletteSelectors.getHueShift);
    const dispatch = useDispatch();

    const handleRowsChange = (rowCount) => {
        const result = dispatch(paletteActions.setHueShift(rowCount));
    }

    return <>
        <NumberInput onValueChange={handleRowsChange} labelText={"xHue Shiftx"} value={rowCount} min={-359} max={359}></NumberInput>
    </>
}