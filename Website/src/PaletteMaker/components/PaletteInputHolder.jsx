
import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../store/palette";
import NumberInput from "./NumberInput";
import ColorInput from "./ColorInput";

export default function PaletteInputHolder(){

    const rowCount = useSelector(paletteSelectors.getRowCount);
    const columnCount = useSelector(paletteSelectors.getColumnCount);
    const seedColor = useSelector(paletteSelectors.getSeedColorHex);
    const dispatch = useDispatch();

    const handleRowsChange = (rowCount) => {
        const result = dispatch(paletteActions.setRowCount(rowCount));
    }

    const handleColumnsChange = (columnCount) => {
        const result = dispatch(paletteActions.setColumnCount(columnCount));
    }

    const handleSeedColorChange = (seedColor) => {
        const result = dispatch(paletteActions.setSeedColor(seedColor));
    }

    return <div className="m-6 flex flex-row" >
        <ColorInput labelText={"xStart Colorxx"} onValueChange={handleSeedColorChange} value={seedColor}></ColorInput>
        <NumberInput onValueChange={handleRowsChange} labelText={"xRowsx"} value={rowCount} max={40}/>
        <NumberInput onValueChange={handleColumnsChange} labelText={"xColumnsx"} value={columnCount} max={40}/>
    </div>
}