
export default function HistoryEntry({isActive, onClick, hasMore, children}){

    let colorClasses = "hover:bg-zinc-400 hover:text-black";
    if(isActive){
        colorClasses = "bg-zinc-500 hover:bg-zinc-300 text-black"
    }
    
    return <>
        <div className={`flex flex-row px-1 justify-between cursor-pointer border-b-2 border-zinc-700 ${colorClasses}` }
        onClick={onClick}
        ><p>{children}</p><p>{hasMore ? ">" : ""}</p></div>
    </>
}