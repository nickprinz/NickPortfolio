
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

export default function PaletteInputHolder(){

    const [currentPhase, setPhase] = useState(1);

    //change this to have tabs, reset button stays outside the tabs
    //first tab will show start color, rows/columns, hue shift, primary colors
    //second tab will have high/low color, desaturated rows/amount
    //third tab will be adjustments with a "click cell to adjust" text when nothing is selected
    //have next/back buttons at each phase, with export in the last phase
    //every tab will have options with, display, reset, export
    //might want display to just always exist
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


    return <>
        <div className="flex flex-row mt-4 gap-3 w-[50rem] relative">
            {(currentPhase > 1) && <SimpleButton onClick={handleBack}>Back</SimpleButton>}
            <div className="flex flex-col mt-4 gap-3 w-[50rem] h-[10rem]  relative">
                {content}
            </div>
            {(currentPhase < 3) && <SimpleButton onClick={handleForward}>Forward</SimpleButton>}
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