import { useSelector } from "react-redux";
import HistoryAction from "./HistoryAction";

export default function HistoryMenu({}){
    //maybe have this show 5 rows with a scrollbar
    
    const {history, currentHistoryAction} = useSelector(state => {
        return state.tree;
    });

    let stepMenu = <></>;
    if(currentHistoryAction >= 0 && currentHistoryAction < history.length ){
        //no active history, show the bottom with ntohing selected
        const currentAction = history[currentHistoryAction];
        stepMenu = <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-40 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            {currentAction.steps.map((s, i) => <div>{s.type}</div>)}
        </div>;
    }

    return <>
    <div className="flex">
        <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-40 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            <HistoryAction key={-1} historyAction={null} historyActionIndex={-1}/>
            {history.map((h, i) => <HistoryAction key={h.id} historyAction={h} historyActionIndex={i}/>)}
        </div>
        {stepMenu}
    </div>
    </>
}