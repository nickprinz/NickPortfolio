import { motion } from "framer-motion";
import { ShowText } from "../store/showText";
import CellInfo from "./CellInfo";
import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../store/palette";

export default function ColorCell({position, size, row, column}){

    const color = useSelector((state) => paletteSelectors.getColorCell(state, row, column));
    const isSelected = useSelector((state) => paletteSelectors.getIsCellActive(state, color.id));
    const infoType = useSelector(paletteSelectors.getShowText);
    const dispatch = useDispatch();
    const onCellClicked = () => {
        dispatch(paletteActions.setActiveCell(color.id));
    }

    let infoText = getInfoText(color, infoType);
    let infoElement = infoText.length > 0 ? <CellInfo text={infoText}/> : <></>;

    const selectedScale = 1.3;//eventually want to math out a more constant or at least max scale
    const selectedAnimate = {scale:[selectedScale-.03, selectedScale], zIndex:10};
    return <>
        <motion.div className="absolute cursor-pointer flex" onClick={() => {onCellClicked()}} style={ 
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
            {infoElement}
        </motion.div>
    </>
}

let toRem = (num) => {
    return `${num}rem`;
}

let getInfoText = (color, infoType) => {
    let infoText = "";
    if(infoType === ShowText.Lum){
        infoText = Math.round(color.lum).toString();
    }
    else if(infoType === ShowText.Hue){
        infoText = Math.round(color.hue).toString();
    }
    else if(infoType === ShowText.Sat){
        infoText = Math.round(color.sat).toString();
    }
    else if(infoType === ShowText.Val){
        infoText = Math.round(color.val).toString();
    }
    else if(infoType === ShowText.Adjust && color.adjustments){
        infoText = `h:${color.adjustments.h} s:${color.adjustments.s} v:${color.adjustments.v}`;
    }
    else if(infoType === ShowText.Chroma){
        infoText = Math.round(color.chr).toString();
    }
    return infoText;
}