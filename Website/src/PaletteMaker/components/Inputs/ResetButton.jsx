import { useDispatch } from "react-redux";
import { paletteActions } from "../../store/palette";
import { useTranslation } from "react-i18next";

export default function ResetButton(){
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("palette");

    const handleClick = () => {
        const result = dispatch(paletteActions.reset());
    }

    return <>
            <button className="absolute right-0 px-2 py-1 my-3 bg-rose-400 rounded-md border-rose-600 border-b-4" onClick={handleClick}>{translate("reset")}</button>
    </>
}