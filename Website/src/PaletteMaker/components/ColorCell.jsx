import { motion } from "framer-motion";
import { ShowText } from "../store/showText";
import CellInfo from "./CellInfo";
import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../store/palette";

export default function ColorCell({position, size, color = {hexColor: "#ffffff", lum: 0, hue: 0, sat:0, val:0, chr:0, }, id}){

    const selectedScale = 1.3;//eventually want to math out a more constant or at least max scale
//currently needing to get a lot of info from the built grid and a lot of specific info from selectors
//I should probably get rid of getColorGrid, just get dimensions instead
//then instead of constructing a grid at once, have a function to get data for each cell which builds out the colors
    const selectedAnimate = {scale:[selectedScale-.03, selectedScale], zIndex:10};
    const isSelected = useSelector((state) => paletteSelectors.getIsCellActive(state, id));
    const infoType = useSelector(paletteSelectors.getShowText);
    const adjustments = useSelector(paletteSelectors.getActiveCellAdjustments);//this is wrong, needs to be for a particular cell
    const dispatch = useDispatch();
    const onCellClicked = () => {
        dispatch(paletteActions.setActiveCell(id));
    }

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
    else if(infoType === ShowText.Adjust && adjustments){
        infoText = `h:${adjustments.h} s:${adjustments.s} v:${adjustments.v}`;
    }
    else if(infoType === ShowText.Chroma){
        infoText = Math.round(color.chr).toString();
    }
    let infoElement = infoText.length > 0 ? <CellInfo text={infoText}/> : <></>;

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
            {infoElement}
        </motion.div>
    </>
}

let toRem = (num) => {
    return `${num}rem`;
}