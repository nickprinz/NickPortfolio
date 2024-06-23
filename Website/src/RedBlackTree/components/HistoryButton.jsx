import MenuButton from "./MenuButton";
import historyIcon from "../images/historyIcon.png"
import HistoryMenu from "./HistoryMenu";
import { AnimatePresence, motion } from "framer-motion";

const yAnimate = -14;
export default function HistoryButton({onClick, showHistory}){
    return <>
        <div className="relative z-20">
            <MenuButton onClick={onClick} dim={!showHistory}>
                <img className="size-5 my-0.5" src={historyIcon}/>
            </MenuButton>
        </div>
        
        <AnimatePresence>
            {showHistory && <motion.div className="absolute z-10" transition={{ duration:.2, }} initial={{opacity: 0, y:yAnimate}} exit={{opacity:0, y:yAnimate}} 
                animate={{opacity:1, x:0, y:0}} >
                <HistoryMenu/>
            </motion.div>}
        </AnimatePresence>
    </>
}