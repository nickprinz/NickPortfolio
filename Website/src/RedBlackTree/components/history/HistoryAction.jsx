
import { useDispatch, useSelector,} from "react-redux";
import { treeActions, treeSelectors } from "../../store/tree";
import HistoryEntry from "./HistoryEntry";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function HistoryAction({historyActionIndex}){
    const dispatch = useDispatch();
    const isActiveAction = useSelector((state) => treeSelectors.selectIsActiveHistoryAction(state, historyActionIndex));
    const actionTextInfo = useSelector((state) => treeSelectors.selectTextForHistoryAction(state, historyActionIndex));
    const { t: translate } = useTranslation("red_black");
    const actionText = translate(actionTextInfo.textkey, actionTextInfo.params);
    
    const handleClick = useCallback(() => {
        if(isActiveAction){
            dispatch(treeActions.moveHistoryCurrent());
            return;   
        }
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:0}));
    }, [isActiveAction]);

    return <>
        <HistoryEntry onClick={handleClick} isActive={isActiveAction} hasMore={historyActionIndex !== -1}>
            {actionText}
        </HistoryEntry>
    </>
}