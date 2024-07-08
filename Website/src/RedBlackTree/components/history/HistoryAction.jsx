
import {useSelector, useDispatch,} from "react-redux";
import { treeActions, treeSelectors } from "../../store/tree";
import HistoryEntry from "./HistoryEntry";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function HistoryAction({historyAction, historyActionIndex}){
    const dispatch = useDispatch();
    const { t: translate } = useTranslation("red_black");
    
    const currentHistoryAction = useSelector(treeSelectors.getActiveHistoryActionIndex);
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

    const actionText = historyAction ? 
        translate(getTextKey(historyAction.name), {value: historyAction.value}) :
        translate("now_history");

    return <>
        <HistoryEntry onClick={handleClick} isActive={isActiveAction} hasMore={historyAction && true}>
            {actionText}
        </HistoryEntry>
    </>
}

const getTextKey = (actionName) => {
    switch (actionName) {
        case "Add":
            return "add_history";
        default:
            break;
    }
}