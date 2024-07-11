
import {useSelector, useDispatch,} from "react-redux";
import { treeActions, treeSelectors } from "../../store/tree";
import HistoryEntry from "./HistoryEntry";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function HistoryStep({historyStepIndex, historyActionIndex}){

    const isActiveStep = useSelector((state) => treeSelectors.selectIsActiveHistoryStep(state, historyStepIndex));
    const stepTextInfo = useSelector(state => treeSelectors.selectTextForHistoryStep(state, historyActionIndex, historyStepIndex));
    const { t: translate } = useTranslation("red_black");
    const dispatch = useDispatch();

    const stepText = translate(stepTextInfo.textkey, stepTextInfo.params);
    
    const handleClick = useCallback(() => {
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:historyStepIndex}));
    }, [historyActionIndex, historyStepIndex])

    return <>
        <HistoryEntry onClick={handleClick} isActive={isActiveStep}>
            {stepText}
        </HistoryEntry>
    </>
}