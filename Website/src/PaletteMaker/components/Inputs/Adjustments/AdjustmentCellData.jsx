
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getIndexesFromId, paletteSelectors } from "../../../store/palette";

export default function AdjustmentCellData({}){
    const { t: translate } = useTranslation("palette");
    const activeCell = useSelector(paletteSelectors.getActiveCell);
    const cellIndex = getIndexesFromId(activeCell);
    const color = useSelector((state) => paletteSelectors.getColorCell(state, cellIndex.X, cellIndex.Y));
    const fullText = `${color.hexColor}  h: ${formatNum(color.hue)} s: ${formatNum(color.sat)} v: ${formatNum(color.val)}`
    return <>
        <div className="text-center whitespace-pre-wrap text-stone-200 p-2 text-lg font-mono">
            {fullText}
        </div>
    </>
}

const formatNum = (num) => {
    const result = Math.round(num).toString().padStart(3," ");
    return result;
}