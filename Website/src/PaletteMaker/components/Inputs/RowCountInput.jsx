import { useDispatch, useSelector } from "react-redux";
import NumberInput from "./NumberInput";
import { paletteActions, paletteSelectors } from "../../store/palette";

export default function RowCountInput(){
    const rowCount = useSelector(paletteSelectors.getRowCount);
    const dispatch = useDispatch();

    const handleRowsChange = (rowCount) => {
        const result = dispatch(paletteActions.setRowCount(rowCount));
    }

    return <>
        <NumberInput onValueChange={handleRowsChange} labelText={"xRowsx"} value={rowCount} max={40}></NumberInput>
    </>
}