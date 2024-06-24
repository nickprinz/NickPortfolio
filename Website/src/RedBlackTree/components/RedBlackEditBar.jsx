import FieldButton from "./FieldButton";
import MenuButton from "./MenuButton";
import RedBlackMenuBar from "./RedBlackMenuBar";

export default function RedBlackEditBar({onAdd, onAddMany, onRemove, onClear, selectedNode, realLength}){

    return <RedBlackMenuBar>
        <div>
            <FieldButton onClick={onAdd}>Insert Number</FieldButton>
            <MenuButton onClick={onAddMany}>+100,000</MenuButton>
        </div>
        <div>
            <MenuButton onClick={onRemove} disabled={selectedNode === -1}>Remove</MenuButton>
            <MenuButton onClick={onClear} dim disabled={realLength <= 0}>Clear All</MenuButton>
        </div>
    </RedBlackMenuBar>
}