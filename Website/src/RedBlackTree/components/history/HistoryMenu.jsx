import { useSelector } from "react-redux";
import HistoryAction from "./HistoryAction";
import HistoryStep from "./HistoryStep";
import { treeSelectors } from "../../store/tree";

export default function HistoryMenu({}){
    const actions = useSelector(state => {
        return state.tree.history.actions;
    });
    
    const currentHistoryAction = useSelector(treeSelectors.selectActiveHistoryAction);
    
    let stepMenu = <></>;
    if(currentHistoryAction ){
        const stepElements = [];
        for (let i = 0; i < currentHistoryAction.stepCount; i++) {
            stepElements.push(<HistoryStep key={currentHistoryAction+"-"+i} historyStepIndex={i} historyActionIndex={currentHistoryAction.index}/>)
        }
        stepElements.push(<HistoryStep key={currentHistoryAction.stepCount} historyStepIndex={currentHistoryAction.stepCount} historyActionIndex={currentHistoryAction.index} />);
        
        stepMenu = <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-52 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            {stepElements}
        </div>;
    }

    return <>
    <div className="flex">
        <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-40 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            <HistoryAction key={-1} historyAction={null} historyActionIndex={-1} isActiveAction={!currentHistoryAction}/>
            {actions.map((h, i) => <HistoryAction key={h.id} historyAction={h} historyActionIndex={i} isActiveAction={currentHistoryAction?.index === i}/>)}
        </div>
        {stepMenu}
    </div>
    </>
}