
import { paletteSelectors } from "../../../store/palette";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AdjustmentTabs from "./AdjustmentTabs";
import { AnimatePresence, motion } from "framer-motion";

export default function AdjustmentContainer({}){
    const { t: translate } = useTranslation("palette");
    const activeCell = useSelector(paletteSelectors.getActiveCell);
    //if I want active tab to stay between cells, add an option for this and set a constant key instead of activeCell
    return <>
            <AnimatePresence>{activeCell && <motion.div 
                transition={{ duration:.1, delay:.04}} initial={{y:"-2rem", opacity:0}} animate={{y:"0rem", opacity:1}} exit={{y:"2rem", opacity:0}} 
                className="absolute">
                <AdjustmentTabs key={activeCell}/>
            </motion.div>}</AnimatePresence>
            {!activeCell && <motion.div 
                transition={{ duration:.2, delay:.2}} initial={{opacity:0}} animate={{opacity:[1]}}
                className="mt-10 text-slate-100 text-2xl relative">{translate("clickACell")}
            </motion.div>}
    </>
}