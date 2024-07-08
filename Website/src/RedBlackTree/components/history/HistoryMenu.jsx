import { useSelector } from "react-redux";
import HistoryAction from "./HistoryAction";
import HistoryStep from "./HistoryStep";

export default function HistoryMenu({}){
    const {history} = useSelector(state => {
        return state.tree;
    });

    const currentHistoryAction = history.currentHistoryAction;

    let stepMenu = <></>;
    if(currentHistoryAction >= 0 && currentHistoryAction < history.actions.length ){
        const currentAction = history.actions[currentHistoryAction];
        stepMenu = <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-52 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            {currentAction.steps.map((s, i) => <HistoryStep key={i} historyStep={s} historyStepIndex={i} historyActionIndex={currentHistoryAction}/>)}
            <HistoryStep key={currentAction.steps.length} historyStep={null} historyStepIndex={currentAction.steps.length} historyActionIndex={currentHistoryAction}/>
        </div>;
    }

    return <>
    <div className="flex">
        <div className="bg-zinc-900 border-2 border-zinc-700 text-zinc-200 w-40 h-32 p-y select-none font-mono gap-y-1 overflow-y-scroll overflow-x-hidden">
            <HistoryAction key={-1} historyAction={null} historyActionIndex={-1}/>
            {history.actions.map((h, i) => <HistoryAction key={h.id} historyAction={h} historyActionIndex={i}/>)}
        </div>
        {stepMenu}
    </div>
    </>
}