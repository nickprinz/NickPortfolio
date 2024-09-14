
export default function InputContainer({children}){

    return <>
        <div className={"flex flex-col bg-slate-500 rounded-lg pb-2 py-1 px-1 border-slate-600 border-b-4"}>
            {children}
        </div>
    </>
}