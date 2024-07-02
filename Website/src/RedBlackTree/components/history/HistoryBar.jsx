
import { useState } from "react";
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "../../store/tree";
import HistoryButton from "./HistoryButton";
import RedBlackMenuBar from "../RedBlackMenuBar";
import MenuButton from "../MenuButton";

export default function HistoryBar({}){
    const dispatch = useDispatch();

    const handleHistoryMove = (amount) => {
        dispatch(treeActions.moveHistory({amount:amount}));
    }

    const handleHistoryAllBack = () => {
        dispatch(treeActions.moveHistoryToStart({}));
    }

    const handleHistoryAllForward = () => {
        dispatch(treeActions.moveHistoryCurrent({}));
    }

    return <RedBlackMenuBar>
        <div>
            <HistoryButton/>
            <MenuButton onClick={handleHistoryAllBack}>{"<<"}</MenuButton>
            <MenuButton onClick={() => handleHistoryMove(-1)}>{"<"}</MenuButton>
            <MenuButton onClick={() => handleHistoryMove(1)}>{">"}</MenuButton>
            <MenuButton onClick={handleHistoryAllForward}>{">>"}</MenuButton>
        </div>
    </RedBlackMenuBar>
}