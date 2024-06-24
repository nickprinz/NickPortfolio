
import NodeElement from "./NodeElement";

const normalSize = 56;
const smallSize = 36;
//rework this to take in a node index and get the value from the useSelector used on the manager
//if dynamically generated classes are not showing up here, add them to TailwindColorFixer
const normalGray = "from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400";
const selectedGray = "from-gray-300 to-gray-400 hover:from-gray-200 hover:to-gray-300";
const normalRed = "from-red-400 to-red-500 hover:from-red-300 hover:to-red-400";
const selectedRed = "from-red-300 to-red-400 hover:from-red-200 hover:to-red-300";
export default function RedBlackNodeElement({onClick, x, y, originX, originY, value, isRed, isSmall, selected}){

    const alwaysClasses = "rounded-full border-2 border-b-black border-x-gray-950 border-t-gray-900 bg-gradient-to-bl from-10% to-90%";
    
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
    const colorClasses = selected ? 
    (isRed ? selectedRed : selectedGray) : 
    (isRed ? normalRed : normalGray);
    
    const nodeSize = isSmall ? smallSize : normalSize;
    
    return <NodeElement onClick={onClick} x={x} y={y} originX={originX} originY={originY} width={nodeSize} height={nodeSize} selectable={!isSmall} 
        flipped={isRed} bgClasses={`${alwaysClasses} ${colorClasses}`} textClasses={textSize} >
        {value}
    </NodeElement>;
}