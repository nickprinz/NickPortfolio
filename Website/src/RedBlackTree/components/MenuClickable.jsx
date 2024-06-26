export default function MenuClickable({image, additionalClasses, onClick, dim, active, disabled, children}){
    let diabledClasses = " disabled:from-zinc-700 disabled:to-zinc-700 disabled:border-zinc-600 disabled:text-zinc-400"
    let colorClasses = `from-red-300 to-red-400 border-red-200 hover:from-red-200 hover:to-red-300 hover:border-t-red-100 ${diabledClasses}`;
    if(dim){
        colorClasses = `from-zinc-500 to-zinc-700 border-zinc-400 hover:from-zinc-400 hover:to-zinc-600 hover:border-t-zinc-300 text-white ${diabledClasses}`;
    }
    if(active){
        colorClasses = `from-red-200 to-red-300 border-red-100 hover:from-red-100 hover:to-red-200 hover:border-t-white ${diabledClasses}`;
    }

    return <>
        <button className={`bg-gradient-to-bl border-t-2 font-mono tracking-wide ${colorClasses} ${additionalClasses}`} onClick={onClick} disabled={disabled}>
            {image && <img className="size-5 mb-0.5 inline" src={image}/>}
            {children}
        </button>
    </>
}