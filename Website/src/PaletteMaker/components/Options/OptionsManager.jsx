
import { useState } from "react";
import OptionsButton from "./OptionsButton";
import OptionsView from "./OptionsView";

export default function OptionsManager(){
    const [showOptions, setShowOptions] = useState(false);

    const handleVisibleClicked = () => {
        setShowOptions((oldState) => {
            return !oldState;
        })
    }

    return <>
    <div className="flex flex-col items-center z-40">
        {showOptions && <OptionsView/>}
        <OptionsButton onClick={handleVisibleClicked} isOpen={showOptions}/>
    </div>
    </>
}