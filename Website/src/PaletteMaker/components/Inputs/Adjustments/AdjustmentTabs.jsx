
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CellAdjustmentsInput from "./CellAdjustmentsInput";
import AdjustmentTypeTab from "./AdjustmentTypeTab";
import ColumnAdjustmentsInput from "./ColumnAdjustmentsInput";
import RowAdjustmentsInput from "./RowAdjustmentsInput";
import AdjustmentCellData from "./AdjustmentCellData";
import { useSelector } from "react-redux";
import { paletteSelectors } from "../../../store/palette";

export default function AdjustmentTabs({}){
    const { t: translate } = useTranslation("palette");
    const [activeTab, setActiveTab] = useState(0);
    const activeCell = useSelector(paletteSelectors.getActiveCell);
    
    const handleClick = (num) => {
        setActiveTab(num);
    }

    let adjustmentsInput = <CellAdjustmentsInput/>;
    if(activeTab === 1){
        adjustmentsInput = <RowAdjustmentsInput/>;
    } else if(activeTab === 2){
        adjustmentsInput = <ColumnAdjustmentsInput/>;
    }

    return <>
        <div className="flex flex-row items-center gap-1">
            <AdjustmentTypeTab onClick={() => {handleClick(0)}} isActive={activeTab === 0}>{translate("cell")}</AdjustmentTypeTab>
            <AdjustmentTypeTab onClick={() => {handleClick(1)}} isActive={activeTab === 1}>{translate("row")}</AdjustmentTypeTab>
            <AdjustmentTypeTab onClick={() => {handleClick(2)}} isActive={activeTab === 2}>{translate("column")}</AdjustmentTypeTab>
        </div>
        <div className="flex flex-row items-center">
            {adjustmentsInput} 
        </div>
        <div className="flex flex-row items-center">
            {activeCell && <AdjustmentCellData/>}
        </div>
    </>
}