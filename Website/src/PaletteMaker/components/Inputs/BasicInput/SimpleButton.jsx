
export default function SimpleButton({onClick, children}){

    return <>
            <button className="bg-rose-400 hover:bg-rose-300 border-rose-600 px-2 py-1 rounded-md border-b-4 h-10 text-center" onClick={onClick}>{children}</button>
    </>
}