export default function RedBlackContainer({children}){
    return <div className="flex flex-col items-center py-6">
    <div className="rounded-3xl border-2 bg-gray-400 border-gray-400 shadow-xl shadow-slate-900">
        <div className="w-[54rem] h-[40rem] bg-gray-300 rounded-3xl border-8 border-gray-700 relative overflow-hidden">
            {children}
        </div>
    </div>
</div>
}