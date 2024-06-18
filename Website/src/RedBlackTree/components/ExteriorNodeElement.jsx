
import NodeElement from "./NodeElement";

export default function ExteriorNodeElement({onClick, x, y, originX, originY, childCount, depth}){
    const alwaysClasses = "rounded-md border-2 border-b-black border-x-gray-950 border-t-gray-900";
    
    let textClasses = "text-xs ";
    const colorClasses = `bg-gray-400 hover:bg-gray-200`;
    
    return <NodeElement onClick={onClick} x={x} y={y} originX={originX} originY={originY} width={48} height={60} selectable={true} 
        bgClasses={`${alwaysClasses} ${colorClasses}`} textClasses={textClasses} >
        More:<br/>{childCount}<br/>Depth:<br/>{depth}
    </NodeElement>;
}