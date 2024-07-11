import MenuButton from "../MenuButton";
import historyIcon from "../../images/historyIcon.png"
import HistoryMenu from "./HistoryMenu";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const yAnimate = -14;
const showAnimation = {opacity:1, y:0};
const hideAnimation = {opacity: 0, y:yAnimate};
export default function HistoryButton({}){
    const [showHistory, setShowHistory] = useState(false);

    const toggleHistory = () => {
        setShowHistory((old) => {
            return !old;
        })
    }

    return <>
        <MenuButton onClick={toggleHistory} active={showHistory} image={historyIcon}/>
        <div className="inline-block">
            <div className="relative w-0 h-5 bg-yellow-400">
                <AnimatePresence>
                    {showHistory && <motion.div className={`absolute z-0 -top-24 ${showHistory ? "" : "pointer-events-none"}`} 
                    transition={{ duration:.3, }} initial={hideAnimation} exit={hideAnimation} animate={showAnimation} >
                        <HistoryMenu/>
                    </motion.div>}
                </AnimatePresence>
            </div>
        </div>

    </>
}