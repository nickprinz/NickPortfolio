
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "../../store/tree";
import HistoryEntry from "./HistoryEntry";
import { useCallback } from "react";
export default function HistoryAction({historyAction, historyActionIndex}){
    const dispatch = useDispatch();
    
    const {currentHistoryAction} = useSelector(state => {
        return state.tree;
    });
    // {
    //     name: name,
    //     steps: [],
    // }
    
    const isActiveAction = currentHistoryAction === historyActionIndex;
    const handleClick = useCallback(() => {
        if(isActiveAction){
            dispatch(treeActions.moveHistoryCurrent());
            return;   
        }
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:0}));
    }, [isActiveAction]);

    return <>
        <HistoryEntry onClick={handleClick} isActive={isActiveAction} hasMore={historyAction && true}>
            {historyAction ? historyAction.name : "Now"}
        </HistoryEntry>
    </>
}