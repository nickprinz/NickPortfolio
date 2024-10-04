import { useDispatch, useSelector } from "react-redux";
import NumberInput from "./BasicInput/NumberInput";
import { paletteActions, paletteSelectors } from "../../store/palette";
import { useTranslation } from "react-i18next";

export default function RowCountInput(){
    const rowCount = useSelector(paletteSelectors.getRowCount);
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("palette");

    const handleRowsChange = (rowCount) => {
        const result = dispatch(paletteActions.setRowCount(rowCount));
    }

    return <>
        <NumberInput onValueChange={handleRowsChange} labelText={translate("rows")} value={rowCount} max={40}></NumberInput>
    </>
}