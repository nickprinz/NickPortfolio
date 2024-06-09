
const nodeHalfSize = 28;//needs to match with size-xx in class

export default function RedBlackNodeElement({x, y, value}){
    let stringValue = value.toString();
    let textSize = "text-xs";
    if(stringValue.length < 4){
        textSize = "text-xl"
    } else if(stringValue.length < 6){
        textSize = "text-base"
    }
    
    return <div className="absolute size-14 rounded-full overflow-hidden 
    bg-radient-circle-tr from-red-400 via-red-400 via-50% to-red-500 to-90% 
    hover:from-rose-300 hover:via-rose-300 hover:via-50% hover:to-rose-400 hover:to-100% 
    border-2 border-b-black border-x-red-950 border-t-purple-900 
    items-centerflex place-content-center cursor-pointer z-20" 
                style={{"left": `${x-nodeHalfSize}px`, "top": `${y-nodeHalfSize}px`}}>
            <p className={`text-center size select-none font-mono ${textSize}`}>{value}</p>
        </div>
}