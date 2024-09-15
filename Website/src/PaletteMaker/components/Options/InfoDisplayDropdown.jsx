import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors, ShowText } from "../../store/palette";
import Dropdown from "../Inputs/Dropdown";

export default function InfoDisplayDropdown(){
    const showText = useSelector(paletteSelectors.getShowText);
    const dispatch = useDispatch();

    const handlevalueSelected = (value) => {
        const result = dispatch(paletteActions.setShowText(value));
    }

    //might want a typescript helper to list all enum
    const dropDownChoices = [
        {value:ShowText.None, text:ShowText.None},
        {value:ShowText.Lum, text:ShowText.Lum},
        {value:ShowText.Hue, text:ShowText.Hue}];

    return <>
        <Dropdown label={"Iinfo display"} choices={dropDownChoices} selectedValue={showText} onSelect={handlevalueSelected}></Dropdown>
    </>
}
