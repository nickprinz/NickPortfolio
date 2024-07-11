import { useSelector } from "react-redux";
import HistoryAction from "./HistoryAction";
import HistoryStep from "./HistoryStep";
import { treeSelectors } from "../../store/tree";

export default function HistoryMenu({}){
    const actions = useSelector(state => {
        return state.tree.history.actions;//fix this
    });
    
    const activeHistoryAction = useSelector(treeSelectors.selectActiveHistoryAction);
    
    let stepMenu = <></>;
    if(activeHistoryAction ){
        const stepElements = [];
        for (let i = 0; i < activeHistoryAction.stepCount; i++) {
            stepElements.push(<HistoryStep key={activeHistoryAction+"-"+i} historyStepIndex={i} historyActionIndex={activeHistoryAction.index}/>)
        }
        stepElements.push(<HistoryStep key={activeHistoryAction.stepCount} historyStepIndex={activeHistoryAction.stepCount} historyActionIndex={activeHistoryAction.index} />);
        
        stepMenu = <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-52 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            {stepElements}
        </div>;
    }

    return <>
    <div className="flex">
        <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-40 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            <HistoryAction key={-1} historyAction={null} historyActionIndex={-1} isActiveAction={!activeHistoryAction}/>
            {actions.map((h, i) => <HistoryAction key={h.id} historyAction={h} historyActionIndex={i} isActiveAction={activeHistoryAction?.index === i}/>)}
        </div>
        {stepMenu}
    </div>
    </>
}