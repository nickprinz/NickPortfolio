import { useSelector } from "react-redux";
import HistoryAction from "./HistoryAction";
import HistoryStep from "./HistoryStep";
import { treeSelectors } from "../../store/tree";

export default function HistoryMenu({}){
    const actions = useSelector(treeSelectors.selectHistoryActionList);
    const activeHistoryAction = useSelector(treeSelectors.selectActiveHistoryAction);
    
    let stepMenu = <></>;
    if(activeHistoryAction ){
        const stepElements = [];
        for (let i = 0; i < activeHistoryAction.stepCount; i++) {
            stepElements.push(<HistoryStep key={activeHistoryAction+"-"+i} historyStepIndex={i} historyActionIndex={activeHistoryAction.index}/>)
        }
         
        stepMenu = <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-52 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            {stepElements}
        </div>;
    }

    return <>
    <div className="flex">
        <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-40 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            {actions.map((h) => <HistoryAction key={h.id} historyActionIndex={h.index}/>)}
        </div>
        {stepMenu}
    </div>
    </>
}