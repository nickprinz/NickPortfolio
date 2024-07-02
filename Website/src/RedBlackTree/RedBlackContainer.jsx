export default function RedBlackContainer({width, height, children}){
    return <>
    <div className="relative">
        <div className="absolute h-0.5 w-full bg-gray-400 -z-10"></div>
    </div>
    <div className="flex flex-col items-center">
        <div className="rounded-b-3xl border-2 border-t-0 bg-gray-400 border-gray-400 shadow-xl shadow-slate-900">
            <div className={`bg-gradient-to-b from-stone-300 to-stone-500 rounded-b-3xl border-[12px] border-t-0 border-zinc-950 overflow-hidden`}
                    style={{"width": `${width}px`, "height": `${height}px`}}>
                <div className="bg-zinc-950">
                    {children}
                </div>
            </div>
        </div>
    </div>
    </>
}