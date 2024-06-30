import { motion } from "framer-motion"
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "../../store/tree";
export default function HistoryAction({historyAction, historyActionIndex}){
    const dispatch = useDispatch();
    // {
    //     name: name,
    //     records: [],
    // }
    //need to be able to set tree to move to the start of an action
    //also need to set a timer to play until the end of an action
    const handleHover = () => {
        dispatch(treeActions.setHistoryPosition({actionIndex: historyActionIndex, stepIndex:0}));
    }

    const handleStopHover = () => {
        dispatch(treeActions.moveHistoryCurrent({}));
    }
    
    return <>
        <motion.div className="flex flex-row px-2 justify-between cursor-pointer hover:bg-zinc-700" 
        onHoverStart={handleHover} onHoverEnd={handleStopHover}
        transition={{ duration:.4, }} initial={{opacity: 0, x:-50}} animate={{opacity:1, x:0}}><p>{historyAction.name}</p><p>{">"}</p></motion.div>
    </>
}