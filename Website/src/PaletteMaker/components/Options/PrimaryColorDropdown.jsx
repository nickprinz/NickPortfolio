import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors, } from "../../store/palette";
import Dropdown from "../Inputs/BasicInput/Dropdown";
import { useTranslation } from "react-i18next";
import { GetAllPrimaryColorOptions, PrimaryColors } from "../../store/primaryColors";

export default function PrimaryColorDropdown(){
    const { t: translate } = useTranslation("palette");
    const showText = useSelector(paletteSelectors.getPrimaryColors);
    const dispatch = useDispatch();

    const handlevalueSelected = (value) => {
        const result = dispatch(paletteActions.setPrimaryColors(value));
    }
    
    const dropDownChoices = GetAllPrimaryColorOptions().map(k => ({value:PrimaryColors[k], text: PrimaryColors[k]}))
    dropDownChoices.forEach(x => {
        x.text = translate(x.text);
    });

    return <>
        <Dropdown label={translate("primary_colors")} choices={dropDownChoices} selectedValue={showText} onSelect={handlevalueSelected}></Dropdown>
    </>
}
