
import ColorInput from "./Inputs/ColorInput";
import RowCountInput from "./Inputs/RowCountInput";
import ColumnCountInput from "./Inputs/ColumnCountInput";
import HueShiftInput from "./Inputs/HueShiftInput";
import LowInput from "./Inputs/LowInput";
import HighInput from "./Inputs/HighInput";
import ResetButton from "./Inputs/ResetButton";
import CellAdjustmentsInput from "./Inputs/CellAdjustmentsInput";

export default function PaletteInputHolder(){

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
                <CellAdjustmentsInput></CellAdjustmentsInput>
                <HighInput />
            </div>
            <ResetButton/>
        </div>
    </> 
}