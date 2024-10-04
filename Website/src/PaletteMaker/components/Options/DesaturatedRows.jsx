import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors, } from "../../store/palette";
import { useTranslation } from "react-i18next";

export default function DesaturatedRows(){
    const { t: translate } = useTranslation("palette");
    const hasDesat = useSelector(paletteSelectors.getDesaturatedRows);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        let value = e.target.checked;
        dispatch(paletteActions.setDesaturatedRows(value));
    }
    //will add text label, maybe also bundle with desat%
    return <>
        <input type="checkbox" checked={hasDesat} className="px-2 mx-1 my-0.5 w-6 text-center tracking-wide" onChange={handleChange} ></input>
    </>
}
