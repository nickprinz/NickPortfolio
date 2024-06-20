
import NodeElement from "./NodeElement";

const normalSize = 56;
const smallSize = 36;
//rework this to take in a node index and get the value from the useSelector used on the manager
//if dynamically generated classes are not showing up here, add them to TailwindColorFixer
export default function RedBlackNodeElement({onClick, x, y, originX, originY, value, isRed, isSmall, selected}){

    const alwaysClasses = "rounded-full border-2 border-b-black border-x-gray-950 border-t-gray-900 bg-radient-circle-tr from-60% to-100%";
    
    let stringValue = value.toString();
    let textSize = "text-xs";
    if(stringValue.length < 4){
        textSize = "text-xl"
    } else if(stringValue.length < 6){
        textSize = "text-base"
    }

    let colorAddAmount = 100;
    let colorName = "gray"
    if(selected){
        colorAddAmount = 0;
    }
    if(isRed){
        colorName = "red";
    }
    const colorClasses = `from-${colorName}-${300+colorAddAmount} to-${colorName}-${500+colorAddAmount} hover:from-${colorName}-${200+colorAddAmount} hover:to-${colorName}-${300+colorAddAmount}`;
    
    const nodeSize = isSmall ? smallSize : normalSize;
    
    return <NodeElement onClick={onClick} x={x} y={y} originX={originX} originY={originY} width={nodeSize} height={nodeSize} selectable={!isSmall} 
        flipped={isRed} bgClasses={`${alwaysClasses} ${colorClasses}`} textClasses={textSize} >
        {value}
    </NodeElement>;
}