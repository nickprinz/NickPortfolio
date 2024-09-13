
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

    const subtract = () => {
        changeValue(value - 1);
    }

    const add = () => {
        changeValue(value + 1);
    }

    return <>
        <div className={"flex flex-col bg-slate-500 rounded-lg m-4 pb-2 py-1 px-1 border-slate-600 border-b-4"}>
            <label className="text-center font-semibold">{labelText}</label>
            <div className="flex flex-row">
                <button className=" size-8" onClick={subtract}>-</button>
                <input value={value} className="px-2 mx-1 my-0.5 w-12 text-right tracking-wide" onChange={handleChange}></input>
                <button className=" size-8" onClick={add}>+</button>
            </div>
        </div>
    </>
}