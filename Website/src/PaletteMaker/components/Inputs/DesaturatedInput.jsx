
import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../../store/palette";
import NumberInput from "./BasicInput/NumberInput";
import InputContainer from "./InputContainer";
import InputLabel from "./InputLabel";

export default function DesaturatedInput(){
    
    
    const hasDesat = useSelector(paletteSelectors.getDesaturatedRows);
    const desatPercent = useSelector(paletteSelectors.getDesaturatedPercent);
    const dispatch = useDispatch();

    const handleCheckChange = (e) => {
        let value = e.target.checked;
        dispatch(paletteActions.setDesaturatedRows(value));
    }

    const handleValChange = (val) => {
        const result = dispatch(paletteActions.setDesaturatedPercent(val));
    }

    return <>
    
        <div className="flex flex-col items-center">
            <InputContainer>
                <InputLabel>{"labelText"}</InputLabel>
                <input type="checkbox" checked={hasDesat} className="px-2 mx-1 my-0.5 w-10 text-center tracking-wide" onChange={handleCheckChange} ></input>
            </InputContainer>
            <NumberInput onValueChange={handleValChange} labelText={"perce"} value={desatPercent} max={100} disabled={!hasDesat}></NumberInput>
        </div>
    </>
}