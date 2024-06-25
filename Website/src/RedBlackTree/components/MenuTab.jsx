import MenuClickable from "./MenuClickable";

export default function MenuTab({...props}){
    return <>
        <MenuClickable {...props} additionalClasses={"rounded-t-2xl px-4 pt-1 m-1 mb-0"}/>
    </>
}