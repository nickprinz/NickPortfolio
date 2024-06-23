import MenuButton from "./MenuButton";
import historyIcon from "../images/historyIcon.png"
import HistoryMenu from "./HistoryMenu";

export default function HistoryButton({onClick}){
    return <>
        <MenuButton onClick={onClick}>
            <img className="size-5 my-0.5" src={historyIcon}/>
        </MenuButton>
        <div className="absolute z-40">
            <HistoryMenu/>
        </div>
    </>
}