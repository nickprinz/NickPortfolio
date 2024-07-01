
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "../../store/tree";
import HistoryEntry from "./HistoryEntry";
export default function HistoryAction({historyAction, historyActionIndex}){
    const dispatch = useDispatch();
    
    const {currentHistoryAction} = useSelector(state => {
        return state.tree;
    });
    // {
    //     name: name,
    //     steps: [],
    // }
    
    const handleClick = () => {
        if(currentHistoryAction === historyActionIndex){
            dispatch(treeActions.moveHistoryCurrent());
            return;   
        }
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:0}));
    }

    return <>
        <HistoryEntry onClick={handleClick} isActive={currentHistoryAction === historyActionIndex} hasMore={historyAction && true}>
            {historyAction ? historyAction.name : "Now"}
        </HistoryEntry>
    </>
}