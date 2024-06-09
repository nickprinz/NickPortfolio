export default function MenuButton({onClick, dim, disabled, children}){
    let diabledClasses = " disabled:from-zinc-700 disabled:to-zinc-700 disabled:border-t-zinc-600 disabled:text-zinc-400"
    let colorClasses = `from-red-300 to-red-400 border-t-2 border-t-red-200 hover:from-rose-200 hover:to-rose-400 hover:border-t-rose-100 ${diabledClasses}`;
    if(dim){
        colorClasses = `from-zinc-500 to-zinc-700 border-t-2 border-t-zinc-400 hover:from-zinc-400 hover:to-zinc-600 hover:border-t-zinc-300 text-white ${diabledClasses}`;
    }

    return <>
        <button className={`rounded-md bg-gradient-to-bl ${colorClasses} font-mono tracking-wide px-4 py-0.5 m-2`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    </>
}