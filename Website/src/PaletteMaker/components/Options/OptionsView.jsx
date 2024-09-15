import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../../store/palette";
import Dropdown from "../Inputs/Dropdown";

export default function OptionsView(){
    const showText = useSelector(paletteSelectors.getShowText);
    const dispatch = useDispatch();

    const handleShowText = (sat) => {
        //const result = dispatch(paletteActions.setHighSat(sat));
    }

    return <>
        <div className="absolute w-80 h-36 bg-slate-400 rounded-b-2xl border-b-4 border-slate-900 border-x-2">
            <div className="h-12"></div>
            <div className="flex ">
                <Dropdown label={"Iinfo display"}></Dropdown>
            </div>
        </div>
    </>
}