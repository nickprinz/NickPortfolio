
export default function RedBlackNode({x, y, value}){
    const classes = `absolute size-20 rounded-full bg-red-500 border-2 border-black items-centerflex place-content-center z-20`;
    return <div className={classes} style={{"left": `${x}px`, "top": `${y}px`}}>
            <p className="text-center">{value}</p>
        </div>
}