
import { AnimatePresence, motion } from "framer-motion";

const nodeHalfSize = 28;//needs to match with size-xx in class
const smallHalfSize = 18;

export default function RedBlackNodeElement({onClick, x, y, value, isRed, isSmall, selected}){
    let stringValue = value.toString();
    let textSize = "text-xs";
    const alwaysClasses = "absolute size-14 rounded-full overflow-hidden bg-radient-circle-tr items-centerflex place-content-center cursor-pointer z-20 via-50% to-100% hover:via-50% hover:to-100%";
    if(stringValue.length < 4){
        textSize = "text-xl"
    } else if(stringValue.length < 6){
        textSize = "text-base"
    }

    let colorClasses = "from-zinc-400 via-zinc-400 to-zinc-500 hover:from-zinc-300 hover:via-zinc-300 hover:to-zinc-400 border-2 border-b-black border-x-zinc-950 border-t-zinc-900";
    if(selected){
        colorClasses = "from-gray-300 via-gray-300 to-gray-400 hover:from-zinc-200 hover:via-zinc-200 hover:to-zinc-300 border-2 border-b-black border-x-zinc-950 border-t-zinc-900"
    }
    if(isRed){
        colorClasses = "from-red-400 via-red-400 to-red-500 hover:from-rose-300 hover:via-rose-300 hover:to-rose-400 border-2 border-b-black border-x-red-950 border-t-purple-900";
        if(selected){
            colorClasses = "from-red-200 via-red-200 to-red-400 hover:from-rose-100 hover:via-rose-100 hover:to-rose-200 border-2 border-b-black border-x-red-950 border-t-purple-900"
        }
    }

    const size = isSmall ? "size-9 pointer-events-none" : "size-14";
    const halfSize = isSmall ? smallHalfSize : nodeHalfSize;
    
    return <motion.div transition={{ duration:.3, }} onClick={onClick} className={`${alwaysClasses} ${size} ${colorClasses} ${textSize}`}
                style={{"left": `${x-halfSize}px`, "top": `${y-halfSize}px`}} disabled={isSmall}>
            <p className={`text-center size select-none font-mono`}>{value}</p>
        </motion.div>
}