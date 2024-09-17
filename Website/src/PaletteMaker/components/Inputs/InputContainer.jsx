
export default function InputContainer({disabled = false, children}){
    
    return <>
        <div className={`flex flex-col ${disabled ? "bg-slate-700 text-slate-800" : "bg-slate-500 text-black"} rounded-lg pb-2 py-1 px-1 border-slate-600 border-b-4`} disabled={disabled}>
            {children}
        </div>
    </>
}