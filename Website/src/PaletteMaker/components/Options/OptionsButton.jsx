import { motion } from "framer-motion";
export default function OptionsButton({onClick, isOpen}){
    
    return <>
        <button className="px-2 py-1 rounded-b-lg bg-slate-300 flex flex-col items-center border-b-2 border-slate-500 z-10" onClick={onClick}>
            <div className="pb-1"> Optionsss </div>
            <motion.div className="w-0 h-0 border-t-slate-800 border-l-transparent border-r-transparent border-l-8 border-r-8 border-t-8"
                animate={{rotate: isOpen ? 180 : 0}}>

            </motion.div>
        </button>
    </>
}