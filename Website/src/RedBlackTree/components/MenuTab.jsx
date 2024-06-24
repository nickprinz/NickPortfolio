export default function MenuTab({onClick, dim, active, disabled, text}){
    let diabledClasses = " disabled:from-zinc-700 disabled:to-zinc-700 disabled:border-t-zinc-600 disabled:text-zinc-400"
    let colorClasses = `from-red-300 to-red-400 border-t-red-200 hover:from-red-200 hover:to-red-300 hover:border-t-red-100 ${diabledClasses}`;
    if(dim){
        colorClasses = `from-zinc-500 to-zinc-700 border-t-zinc-400 hover:from-zinc-400 hover:to-zinc-600 hover:border-t-zinc-300 text-white ${diabledClasses}`;
    }
    if(active){
        colorClasses = `from-red-200 to-red-300 border-t-red-100 hover:from-red-100 hover:to-red-200 hover:border-t-white ${diabledClasses}`;
    }

    return <>
        <button className={`rounded-t-2xl bg-gradient-to-bl border-t-2 ${colorClasses} font-mono tracking-wide px-4 pt-1 m-1 mb-0`} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    </>
}