import FieldButton from "./FieldButton";
import MenuButton from "./MenuButton";
import RedBlackMenuBar from "./RedBlackMenuBar";
import { useTranslation } from "react-i18next";

export default function RedBlackEditBar({onAdd, onAddMany, onRemove, onClear, selectedNode, realLength}){
    const { t: translate } = useTranslation("red_black");

    return <RedBlackMenuBar>
        <div>
            <FieldButton onClick={onAdd}>+</FieldButton>
            <MenuButton onClick={onAddMany}>+100,000</MenuButton>
        </div>
        <div>
            <MenuButton onClick={onRemove} disabled={selectedNode === -1}>{translate("remove_node")}</MenuButton>
            <MenuButton onClick={onClear} dim disabled={realLength <= 0}>{translate("clear_all_nodes")}</MenuButton>
        </div>
    </RedBlackMenuBar>
}