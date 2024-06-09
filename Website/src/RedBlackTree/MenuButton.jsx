export default function MenuButton({onClick, children}){
    return <>
        <button className="rounded-md bg-red-400 border-t-2  border-t-red-200 px-4 py-0.5 m-2" onClick={onClick}>{children}</button>
    </>
}