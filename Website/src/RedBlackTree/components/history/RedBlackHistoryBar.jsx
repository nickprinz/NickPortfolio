
import { useState } from "react";
import HistoryButton from "./HistoryButton";
import RedBlackMenuBar from "../RedBlackMenuBar";

export default function RedBlackHistoryBar({}){
    const [showHistory, setShowHistory] = useState(false);

    const toggleHistory = () => {
        setShowHistory((old) => {
            return !old;
        })
    }

    return <RedBlackMenuBar>
        <div>
            <HistoryButton showHistory={showHistory} onClick={toggleHistory}/>
        </div>
    </RedBlackMenuBar>
}