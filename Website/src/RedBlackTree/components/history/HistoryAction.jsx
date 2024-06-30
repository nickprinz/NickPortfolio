
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "../../store/tree";
export default function HistoryAction({historyAction, historyActionIndex}){
    const dispatch = useDispatch();
    
    const {currentHistoryAction} = useSelector(state => {
        return state.tree;
    });
    // {
    //     name: name,
    //     records: [],
    // }
    //need to be able to set tree to move to the start of an action
    //also need to set a timer to play until the end of an action
    const handleClick = () => {
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:0}));
    }

    let colorClasses = "hover:bg-zinc-400 hover:text-black";
    if(currentHistoryAction === historyActionIndex){
        colorClasses = "bg-zinc-500 hover:bg-zinc-300 text-black"
    }
    
    return <>
        <div className={`flex flex-row px-2 justify-between cursor-pointer  ${colorClasses}` }
        onClick={handleClick}
        ><p>{historyAction ? historyAction.name : "Now"}</p><p>{historyAction ? ">" : ""}</p></div>
    </>
}