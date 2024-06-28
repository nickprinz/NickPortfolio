
import { useState } from "react";
import HistoryButton from "./HistoryButton";
import RedBlackMenuBar from "../RedBlackMenuBar";
import MenuButton from "../MenuButton";

export default function RedBlackHistoryBar({onHistoryBack, onHistoryForward}){
    const [showHistory, setShowHistory] = useState(false);

    const toggleHistory = () => {
        setShowHistory((old) => {
            return !old;
        })
    }

    return <RedBlackMenuBar>
        <div>
            <HistoryButton showHistory={showHistory} onClick={toggleHistory}/>
            <MenuButton onClick={onHistoryBack}>{"<"}</MenuButton>
            <MenuButton onClick={onHistoryForward}>{">"}</MenuButton>
        </div>
    </RedBlackMenuBar>
}