import { useDispatch } from "react-redux";
import { paletteActions } from "../../store/palette";

export default function ResetButton(){
    const dispatch = useDispatch();

    const handleClick = () => {
        const result = dispatch(paletteActions.reset());
    }

    return <>
            <button className="absolute right-0 px-2 py-1 my-3 bg-rose-400 rounded-md border-rose-600 border-b-4" onClick={handleClick}>rredset</button>
    </>
}