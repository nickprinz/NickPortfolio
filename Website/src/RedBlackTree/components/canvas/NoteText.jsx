import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function NoteText({text, width, height, onRight}){
    const justifyStyle = onRight ? {right:"0px"} : {left:"0px"};
    const { t: translate } = useTranslation("red_black");
    const noteText = translate(text, {});
    
    
    return <motion.div className="bg-stone-500 right-0 w-60 h-16 absolute border-2 z-30 border-black font-mono m-1 p-1 leading-4 text-xs overflow-y-scroll"
        style={ {...justifyStyle, width:`${width}px`, height:`${height}px`} }
        >
            {noteText}
        </motion.div>
}