
import { motion } from "framer-motion";

const nodeHalfSize = 28;//needs to match with size-xx in class
const smallHalfSize = 18;

export default function RedBlackNodeElement({onClick, x, y, originX, originY, value, isRed, isSmall, selected}){
    //need to refactor this to separate out of tree indicators
    if(originX === undefined) originX = x;
    if(originY === undefined) originY = y;
    let stringValue = value.toString();
    let textSize = "text-xs";
    const alwaysClasses = "absolute size-14 rounded-full overflow-hidden bg-radient-circle-tr items-centerflex place-content-center cursor-pointer z-20 via-50% to-100% hover:via-50% hover:to-100%";
    if(stringValue.length < 4){
        textSize = "text-xl"
    } else if(stringValue.length < 6){
        textSize = "text-base"
    }

    let colorClasses = "from-gray-400 via-gray-400 to-gray-500 hover:from-gray-300 hover:via-gray-300 hover:to-gray-400 border-2 border-b-black border-x-gray-950 border-t-gray-900";
    if(selected){
        colorClasses = "from-gray-300 via-gray-300 to-gray-400 hover:from-gray-200 hover:via-gray-200 hover:to-gray-300 border-2 border-b-black border-x-gray-950 border-t-gray-900"
    }
    if(isRed){
        colorClasses = "from-red-400 via-red-400 to-red-500 hover:from-red-300 hover:via-red-300 hover:to-red-400 border-2 border-b-black border-x-gray-950 border-t-gray-900";
        if(selected){
            colorClasses = "from-red-200 via-red-200 to-red-400 hover:from-red-200 hover:via-red-200 hover:to-red-300 border-2 border-b-black border-x-gray-950 border-t-gray-900"
        }
    }

    const size = isSmall ? "size-9 pointer-events-none" : "size-14";
    const halfSize = isSmall ? smallHalfSize : nodeHalfSize;
    const scaleX = isRed ? -1 : 1;
    
    return <motion.div transition={{ duration:.8, }} initial={{x:originX, y:originY, scale: 0, scaleX:scaleX}} exit={{x:x, y:y}} animate={{x:[null,x,x], y:[null,y,y], opacity:1, scale:[null,null,1], scaleX:scaleX}} 
                onClick={onClick} className={`${alwaysClasses} ${size} ${colorClasses} ${textSize}`}
                style={{"left": `${-halfSize}px`, "top": `${-halfSize}px`}} disabled={isSmall}>
            <motion.p initial={{scaleX:scaleX}} animate={{scaleX:scaleX}} className={`text-center size select-none font-mono`}>{value}</motion.p>
        </motion.div>
}