import MenuClickable from "./MenuClickable";

export default function MenuButton({...props}){
    return <>
        <MenuClickable {...props} additionalClasses={"rounded-md px-4 py-0.5 m-2"}/>
    </>
}