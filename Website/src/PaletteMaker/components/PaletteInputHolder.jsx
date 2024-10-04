
import ColorInput from "./Inputs/BasicInput/ColorInput";
import RowCountInput from "./Inputs/RowCountInput";
import ColumnCountInput from "./Inputs/ColumnCountInput";
import HueShiftInput from "./Inputs/HueShiftInput";
import LowInput from "./Inputs/LowInput";
import HighInput from "./Inputs/HighInput";
import ResetButton from "./Inputs/ResetButton";
import AdjustmentContainer from "./Inputs/Adjustments/AdjustmentContainer";

export default function PaletteInputHolder(){

    //change this to have tabs, reset button stays outside the tabs
    //first tab will show start color, rows/columns, hue shift
    //second tab will have high/low color and still start color
    //third tab will be adjustments with a "click cell to adjust" text when nothing is selected
    //have next/back buttons at each phase, with export in the last phase
    //maybe have an option to switch between guided and full ui
    return <>
        <div className="flex flex-col mt-4 gap-3 w-[50rem] relative">
            <div className="flex flex-row gap-4 justify-center" >
                <ColorInput ></ColorInput>
                <RowCountInput />
                <ColumnCountInput />
                <HueShiftInput/>
            </div>
            <div className="flex flex-row justify-between gap-4" >
                <LowInput />
                <AdjustmentContainer/>
                <HighInput />
            </div>
            <ResetButton/>
        </div>
    </> 
}