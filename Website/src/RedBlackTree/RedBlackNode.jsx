
const nodeHalfSize = 40;//needs to match with size-20 in class

export default function RedBlackNode({x, y, value}){
    return <div className="absolute size-20 rounded-full bg-radient-ellipse-c from-red-500 to-red-400 to-80% hover:from-rose-400 hover:to-rose-300 hover:to-80% border-2 border-black items-centerflex place-content-center cursor-pointer z-20" 
                style={{"left": `${x-nodeHalfSize}px`, "top": `${y-nodeHalfSize}px`}}>
            <p className="text-center size select-none">{value}</p>
        </div>
}