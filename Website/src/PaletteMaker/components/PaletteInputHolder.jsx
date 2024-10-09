
import ColorInput from "./Inputs/BasicInput/ColorInput";
import RowCountInput from "./Inputs/RowCountInput";
import ColumnCountInput from "./Inputs/ColumnCountInput";
import HueShiftInput from "./Inputs/HueShiftInput";
import LowInput from "./Inputs/LowInput";
import HighInput from "./Inputs/HighInput";
import ResetButton from "./Inputs/ResetButton";
import AdjustmentContainer from "./Inputs/Adjustments/AdjustmentContainer";
import { useState } from "react";
import SimpleButton from "./Inputs/BasicInput/SimpleButton";
import DesaturatedInput from "./Inputs/DesaturatedInput";
import PNGImage from "pnglib-es6";
import { createCellFromState } from "../store/createCellFromState";
import { useSelector } from "react-redux";
import { paletteSelectors } from "../store/palette";

export default function PaletteInputHolder(){

    const [currentPhase, setPhase] = useState(1);

    const fullState = useSelector(state => state.palette);//just grabbing the whole state here is very weird to do, but I don't want to rebuild the grid on this button
    const rowCount = useSelector(paletteSelectors.getGridRowCount);
    const columnCount = useSelector(paletteSelectors.getColumnCount);

    let content = phase1();
    if(currentPhase === 2){
        content = phase2();
    }
    else if (currentPhase === 3){
        content = phase3();
    }


    const handleBack = () => {
        setPhase((oldState) => {
            if( oldState < 1) return 1;
            return oldState - 1;
        })
    }

    const handleForward = () => {
        setPhase((oldState) => {
            if( oldState > 3) return 3;
            return oldState + 1;
        })
    }

    const handleExport = () => {
        const png = makeGridImage(fullState, rowCount, columnCount);
        const url = png.getDataURL();
        const link = document.createElement("a");
        link.download = "palette.png";
        link.href = url;
        link.click();
    }


    return <>
        <div className="flex flex-row mt-4 gap-3 w-[50rem] relative">
            {(currentPhase > 1) && <SimpleButton onClick={handleBack}>Back</SimpleButton>}
            <div className="flex flex-col mt-4 gap-3 w-[50rem] h-[10rem]  relative">
                {content}
            </div>
            {(currentPhase < 3) && <SimpleButton onClick={handleForward}>Forward</SimpleButton>}
            {(currentPhase == 3) && <SimpleButton onClick={handleExport}>Export</SimpleButton>}
        </div>
    </> 
}

const phase1 = () => {
    return <>
        <div className="flex flex-row gap-4 justify-center" >
            <ColorInput ></ColorInput>
            <HueShiftInput/>
        </div>
        <div className="flex flex-row gap-4 justify-center" >
            <RowCountInput />
            <ColumnCountInput />
        </div>
    </>
}

const phase2 = () => {
    return <>
        <div className="flex flex-row gap-4 justify-between" >
            <LowInput />
            <DesaturatedInput/>
            <HighInput />
        </div>
    </>
}

const phase3 = () => {
    return <>
        <div className="flex flex-row gap-4 justify-center" >
            <AdjustmentContainer/>
        </div>
    </>
}

const makeGridImage = (fullState, rowCount, columnCount) => {
    //curent bug with this png library: it always indexes a transparent color, which is bad for palette exporting
    const png = new PNGImage(columnCount,rowCount,(rowCount*columnCount)+1);
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < columnCount; j++) {
            const cell = createCellFromState(fullState,i,j);
            const color = png.createColor(cell.hexColor);
            png.setPixel(j, i, color);
            
        }
    }
    return png;
}