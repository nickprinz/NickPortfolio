import { useDispatch, useSelector } from "react-redux";
import NumberInput from "./NumberInput";
import { paletteActions, paletteSelectors } from "../../store/palette";

export default function ColumnCountInput(){
    const columnCount = useSelector(paletteSelectors.getColumnCount);
    const dispatch = useDispatch();

    const handleRowsChange = (columnCount) => {
        const result = dispatch(paletteActions.setColumnCount(columnCount));
    }

    return <>
        <NumberInput onValueChange={handleRowsChange} labelText={"xColumnsx"} value={columnCount} max={40}></NumberInput>
    </>
}