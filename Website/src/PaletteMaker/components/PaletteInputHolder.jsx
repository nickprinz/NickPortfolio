
import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../store/palette";
import NumberInput from "./NumberInput";

export default function PaletteInputHolder(){

    const rowCount = useSelector(paletteSelectors.getRowCount);
    const columnCount = useSelector(paletteSelectors.getColumnCount);
    const dispatch = useDispatch();

    const handleRowsChange = (rowCount) => {
        const result = dispatch(paletteActions.setRowCount(rowCount));
    }

    const handleColumnsChange = (columnCount) => {
        const result = dispatch(paletteActions.setColumnCount(columnCount));
    }

    return <div className="m-6" >
        <NumberInput onValueChange={handleRowsChange} labelText={"xRowsx"} value={rowCount}/>
        <NumberInput onValueChange={handleColumnsChange} labelText={"xColumnsx"} value={columnCount}/>
    </div>
}