import MenuTab from "./MenuTab";

export default function MenuTabBar({tabNames, activeIndex, onTabClicked}){
    return <>
    <div>
        {tabNames.map((x,i) => <MenuTab key={x} onClick={() => onTabClicked(x,i)} dim={activeIndex !== i}>{x}</MenuTab>)}
    </div>
    </>
}