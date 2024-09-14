import { useDispatch, useSelector } from "react-redux";
import { HexToRGB } from "../../store/colorHelpers";
import { paletteActions, paletteSelectors } from "../../store/palette";
import InputContainer from "./InputContainer";
import InputLabel from "./InputLabel";

export default function ColorInput(){

    const seedColor = useSelector(paletteSelectors.getSeedColorHex);
    const dispatch = useDispatch();

    const handleSeedColorChange = (e) => {
        let hexColor = HexToRGB(e.target.value);
        const result = dispatch(paletteActions.setSeedColor(hexColor));
    }

    return <>
        <InputContainer>
            <InputLabel>{"xStart Colorxx"}</InputLabel>
            <input value={seedColor} type="color" className="w-32 h-8 mx-2 mb-1 py-0 text-right" onChange={handleSeedColorChange}></input>
        </InputContainer>
    </>
}