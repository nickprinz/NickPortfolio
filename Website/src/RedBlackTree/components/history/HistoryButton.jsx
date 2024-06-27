import MenuButton from "../MenuButton";
import historyIcon from "../../images/historyIcon.png"
import HistoryMenu from "./HistoryMenu";
import { AnimatePresence, motion } from "framer-motion";

const yAnimate = -14;
const showAnimation = {opacity:1, y:0};
const hideAnimation = {opacity: 0, y:yAnimate};
export default function HistoryButton({onClick, showHistory}){
    return <>
            <MenuButton onClick={onClick} active={showHistory}>
                <img className="size-5 my-0.5" src={historyIcon}/>
            </MenuButton>
        
        <motion.div className={`absolute z-10 `} transition={{ duration:.3, }} initial={hideAnimation} exit={hideAnimation} 
            animate={showHistory ? showAnimation : hideAnimation} >
            <HistoryMenu/>
        </motion.div>
    </>
}