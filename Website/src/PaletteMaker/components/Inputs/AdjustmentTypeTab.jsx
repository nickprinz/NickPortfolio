
export default function AdjustmentTypeTab({onClick, isActive, children}){

    let colors = "border-slate-700 from-slate-800 text-slate-300";
    if(isActive){
        colors = "border-slate-300 from-slate-600 text-slate-100";
    }

    return <>
    <button className={`px-2 py-1 border-t-2 rounded-t-lg bg-gradient-to-b to-transparent text-xl ${colors}`} onClick={onClick}>
        {children}
    </button>

    </>
}