import { motion } from "framer-motion";

export default function LineBetween({toPoint, fromPoint, lineFn = getLine}){
    const {xPos, yPos, width, rotate} = lineFn(toPoint, fromPoint)
    
    return <motion.div className="absolute h-1 bg-black rounded" role="separator"
        transition={{ duration:.8, }} initial={{x:fromPoint.x, y:fromPoint.y, opacity:0, scale: 1, width:0, rotate:rotate}} exit={{x:xPos, y:yPos}} animate={{x:xPos, y:yPos, opacity:1, scale:1, width:width, rotate:rotate}} 
        ></motion.div>
}

export function getLine(toPoint, fromPoint){
    const xDif = toPoint.x - fromPoint.x;
    const yDif = toPoint.y - fromPoint.y;
    let angle = Math.PI/2;
    if(xDif !== 0){
        angle = Math.atan(yDif/xDif);
    } 
    const width = Math.hypot(xDif, yDif);
    const xPos = Math.min(toPoint.x, fromPoint.x) - ((1-Math.cos(angle))*(width/2));
    const yPos = (toPoint.y + fromPoint.y) / 2;
    const rotate = 180*angle/Math.PI;

    return {xPos, yPos, width, rotate};
}