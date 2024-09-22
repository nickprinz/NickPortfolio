import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors, } from "../../store/palette";
import { GetAllShowTextOptions, ShowText } from "../../store/showText";
import Dropdown from "../Inputs/Dropdown";
import { useTranslation } from "react-i18next";

export default function InfoDisplayDropdown(){
    const { t: translate } = useTranslation("palette");
    const showText = useSelector(paletteSelectors.getShowText);
    const dispatch = useDispatch();

    const handlevalueSelected = (value) => {
        const result = dispatch(paletteActions.setShowText(value));
    }
    
    const dropDownChoices = GetAllShowTextOptions().map(k => ({value:ShowText[k], text: ShowText[k]}))
    dropDownChoices.forEach(x => {
        x.text = translate(x.text);
    });

    return <>
        <Dropdown label={translate("info_display")} choices={dropDownChoices} selectedValue={showText} onSelect={handlevalueSelected}></Dropdown>
    </>
}
