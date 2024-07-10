
import {useSelector, useDispatch,} from "react-redux";
import { treeActions, treeSelectors } from "../../store/tree";
import HistoryEntry from "./HistoryEntry";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function HistoryStep({historyStepIndex, historyActionIndex, isActiveStep}){
    
    const { t: translate } = useTranslation("red_black");
    const dispatch = useDispatch();

    const stepTextInfo = useSelector(state => {
        return treeSelectors.selectTextForHistoryStep(state, historyActionIndex, historyStepIndex);
    })

    const stepText = translate(stepTextInfo.textkey, stepTextInfo.params);
    
    const handleClick = useCallback(() => {
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:historyStepIndex}));
    }, [isActiveStep])

    return <>
        <HistoryEntry onClick={handleClick} isActive={isActiveStep}>
            {stepText}
        </HistoryEntry>
    </>
}