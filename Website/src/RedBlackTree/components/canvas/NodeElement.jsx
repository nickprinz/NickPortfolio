import { motion } from "framer-motion";

//this and LineBetween need to get an isProcessing from useSelector to greatly lower animation duration
export default function NodeElement({onClick, x, y, originX, originY, children, bgClasses, textClasses, width, height, selectable, flipped}){
    
    if(originX === undefined) originX = x;
    if(originY === undefined) originY = y;
    const alwaysClasses = "absolute overflow-hidden items-centerflex place-content-center cursor-pointer z-20";
    const selectClass = selectable ? "" : "pointer-events-none";
    const scaleX = flipped ? -1 : 1;
    
    return <motion.div transition={{ duration:.8, }} initial={{x:originX, y:originY, scale: 0, scaleX:scaleX}} exit={{scale:0}} 
                animate={{x:[null,x,x], y:[null,y,y], opacity:1, scale:[null,null,1], scaleX:scaleX}} 
                onClick={onClick} className={`${alwaysClasses} ${bgClasses} ${selectClass}`}
                style={{"left": `${-width/2}px`, "top": `${-height/2}px`, "width": `${width}px`, "height": `${height}px`}} disabled={!selectable}>
            <motion.p initial={{scaleX:scaleX}} animate={{scaleX:scaleX}} className={`text-center select-none font-mono ${textClasses} leading-3`}>{children}</motion.p>
        </motion.div>
}