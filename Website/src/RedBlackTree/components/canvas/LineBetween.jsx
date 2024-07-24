import { motion } from "framer-motion";
import getLine from "./getLineFromPoints";

export default function LineBetween({toPoint, fromPoint, duration = .8, delay = .1}){
    const {xPos, yPos, width, rotate} = getLine(toPoint, fromPoint)
    
    return <motion.div className="absolute h-1 bg-black rounded" role="separator"
        transition={{ duration: duration, delay:delay}} 
        initial={{x:fromPoint.x, y:fromPoint.y, opacity:0, scale: 0, width:0, rotate:rotate}} 
        exit={{x:xPos, y:yPos}} 
        animate={{x:[null,xPos,xPos], y:[null,yPos,yPos], opacity:1, scale:[null, null, 1], width:[null, width, width], rotate:[null, rotate, rotate]}} 
        ></motion.div>
}