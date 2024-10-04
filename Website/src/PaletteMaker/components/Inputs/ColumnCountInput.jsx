import { useDispatch, useSelector } from "react-redux";
import NumberInput from "./BasicInput/NumberInput";
import { paletteActions, paletteSelectors } from "../../store/palette";
import { useTranslation } from "react-i18next";

export default function ColumnCountInput(){
    const columnCount = useSelector(paletteSelectors.getColumnCount);
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("palette");

    const handleRowsChange = (columnCount) => {
        const result = dispatch(paletteActions.setColumnCount(columnCount));
    }

    return <>
        <NumberInput onValueChange={handleRowsChange} labelText={translate("columns")} value={columnCount} max={40}></NumberInput>
    </>
}