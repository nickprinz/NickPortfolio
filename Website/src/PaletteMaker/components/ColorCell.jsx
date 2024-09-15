import { motion } from "framer-motion";
import { ShowText } from "../store/palette";
import CellInfo from "./CellInfo";

export default function ColorCell({position, size, color = {hexColor: "#ffffff", lum: 0, hue: 0}, id, isSelected, onCellClicked, infoType = ShowText.None}){

    const selectedScale = 1.3;//eventually want to math out a more constant or at least max scale

    const selectedAnimate = {scale:[selectedScale-.03, selectedScale], zIndex:10};

    let infoText = <></>;
    if(infoType === ShowText.Lum){
        infoText = <CellInfo>
                {Math.round(color.lum)}
        </CellInfo>
    }
    else if(infoType === ShowText.Hue){
        infoText = <CellInfo>
                {Math.round(color.hue)}
        </CellInfo>
    }

    return <>
        <motion.div className="absolute cursor-pointer flex" onClick={() => {onCellClicked(id)}} style={ 
        {
            width:toRem(size.X), 
            height:toRem(size.Y),
            left:toRem(position.X), 
            top:toRem(position.Y),
            backgroundColor: color.hexColor,
            zIndex:0,
        }}
            transition={isSelected ? { duration:1.3, delay:.01, repeat:Infinity, repeatType:"mirror"} : { duration:.4, delay:.01, repeat: 0}}
            initial={{scale:[0,.8], repeat:0}}
            animate={isSelected ? selectedAnimate : {scale:1, zIndex:[9,8,1],}}//z is not properly animating down yet
            whileHover={isSelected ? selectedAnimate : {scale:selectedScale-.14, zIndex:20} }
        >
            {infoText}
        </motion.div>
    </>
}

let toRem = (num) => {
    return `${num}rem`;
}