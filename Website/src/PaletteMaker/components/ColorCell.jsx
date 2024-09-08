import { motion } from "framer-motion";

export default function ColorCell({position, size, color = "#ffffff", id, isSelected, onCellClicked}){

    let selectedScale = 1.1;//eventually want to math out a more constant or at least max scale

    return <>
    <motion.div className="absolute cursor-pointer" onClick={() => {onCellClicked(id)}} style={ 
    {
        width:toRem(size.X), 
        height:toRem(size.Y),
        left:toRem(position.X), 
        top:toRem(position.Y),
        backgroundColor: color,
        zIndex:0,
    }}
    transition={isSelected ? { duration:1.3, delay:.01, repeat:Infinity, repeatType:"mirror"} : { duration:.4, delay:.01, repeat: 0}}
    initial={{scale:[0,.8], repeat:0}}
    animate={isSelected ? {scale:[selectedScale, 1.16], zIndex:10} : {scale:1, zIndex:[9,8,1],}}//z is not properly animating down yet
    whileHover={{scale:1.16, zIndex:20} }
    >
    </motion.div>
    </>
}

let toRem = (num) => {
    return `${num}rem`;
}