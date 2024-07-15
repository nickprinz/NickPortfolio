import { motion } from "framer-motion";

export default function NoteText({text, width, height, onRight}){
    const justifyStyle = onRight ? {right:"0px"} : {left:"0px"};

    
    return <motion.div className="bg-stone-500 right-0 w-60 h-16 absolute border-2 border-black font-mono m-1 p-1"
        style={ {...justifyStyle, width:`${width}px`, height:`${height}px`} }
        >
            {text}
        </motion.div>
}