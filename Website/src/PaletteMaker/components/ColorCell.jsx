import { motion } from "framer-motion";

export default function ColorCell({position, size, color = "#ffffff", id, isSelected, onCellClicked}){

    let selectedScale = 1.2;//eventually want to math out a more constant or at least max scale

    return <>
    <motion.div className="absolute" onClick={() => {onCellClicked(id)}} style={ 
    {
        width:toRem(size.X), 
        height:toRem(size.Y),
        left:toRem(position.X), 
        top:toRem(position.Y),
        backgroundColor: color,
        zIndex:0,
    }}
    transition={{ duration:.3, delay:.01,}}
    animate={isSelected ? {scale:selectedScale, zIndex:10} : {scale:1, zIndex:1}}//z is not properly animating down yet
    >
    </motion.div>
    </>
}

let toRem = (num) => {
    return `${num}rem`;
}