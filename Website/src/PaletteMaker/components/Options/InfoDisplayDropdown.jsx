import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors, } from "../../store/palette";
import { GetAllShowTextOptions, ShowText } from "../../store/showText";
import Dropdown from "../Inputs/Dropdown";

export default function InfoDisplayDropdown(){
    const showText = useSelector(paletteSelectors.getShowText);
    const dispatch = useDispatch();

    const handlevalueSelected = (value) => {
        const result = dispatch(paletteActions.setShowText(value));
    }
    
    const dropDownChoices = GetAllShowTextOptions().map(k => ({value:ShowText[k], text: ShowText[k]}))

    return <>
        <Dropdown label={"Iinfo display"} choices={dropDownChoices} selectedValue={showText} onSelect={handlevalueSelected}></Dropdown>
    </>
}
