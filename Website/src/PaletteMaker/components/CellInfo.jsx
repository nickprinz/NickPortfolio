
export default function CellInfo({text}){
    let textSize = "text-base";
    if(text.length > 4) textSize = "text-sm"
    if(text.length > 8) textSize = "text-xs"
    return <div className={`text-center flex flex-col items-center select-none m-auto ${textSize}`} >
            <div className="bg-white rounded-md px-2 py-1 select-none">
                {text}
            </div>
        </div>
}