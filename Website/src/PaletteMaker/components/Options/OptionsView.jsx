
import InfoDisplayDropdown from "./InfoDisplayDropdown";
import PrimaryColorDropdown from "./PrimaryColorDropdown";

export default function OptionsView(){


    return <>
        <div className="absolute w-80 h-36 bg-slate-400 rounded-b-2xl border-b-4 border-slate-900 border-x-2">
            <div className="h-12"></div>
            <div className="flex ">
                <InfoDisplayDropdown/>
                <PrimaryColorDropdown/>
            </div>
        </div>
    </>
}