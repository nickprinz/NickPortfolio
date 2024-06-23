import { useSelector } from "react-redux";

export default function HistoryMenu({currentHistory}){
    //maybe have this show 5 rows with a scrollbar
    
    const {history} = useSelector(state => {
        return state.tree;
    });

    if(currentHistory < 0 || currentHistory >= history.length ){
        //no active history, show the bottom with ntohing selected
    }

    return <>
        <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-36 p-2 select-none font-mono gap-y-1">
            {history.map((h,i) => <div key={i}>{h.name}</div>)}

        </div>
    </>
}