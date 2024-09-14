
import IncrementButton from "./IncrementButton";
import InputContainer from "./InputContainer";
import InputLabel from "./InputLabel";

export default function NumberInput({onValueChange, labelText, value, max = 100, min = 0}){
    
    const handleChange = (e) =>{
        let num = Math.round(e.target.value);
        changeValue(num);
    }

    const changeValue = (newValue) => {
        if(isNaN(newValue)) {
            onValueChange(value);
            return;
        }
        newValue = Math.min(Math.max(newValue, min), max);
        
        onValueChange(newValue);
    }

    const adjust = (adjustmentAmount) => {
        changeValue(value + adjustmentAmount);//problem, value is not changing for a hold down button
    }

    return <>
        <InputContainer>
            <InputLabel>{labelText}</InputLabel>
            <div className="flex flex-row">
                <IncrementButton onValueChange={adjust} amount={-1} />
                <input value={value} className="px-2 mx-1 my-0.5 w-12 text-center tracking-wide" onChange={handleChange}></input>
                <IncrementButton onValueChange={adjust} amount={1} />
            </div>
        </InputContainer>
    </>
}