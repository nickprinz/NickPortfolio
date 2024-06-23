import { motion } from "framer-motion"
export default function HistoryAction({historyAction}){
    // {
    //     name: name,
    //     records: [],
    // }
    
    return <>
        <motion.div className="flex flex-row justify-between cursor-pointer" transition={{ duration:.4, }} initial={{opacity: 0, x:-50}} animate={{opacity:1, x:0}}><p>{historyAction.name}</p><p>{">"}</p></motion.div>
    </>
}