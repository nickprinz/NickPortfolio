import { useDispatch, useSelector } from "react-redux";
import FieldButton from "./FieldButton";
import MenuButton from "./MenuButton";
import RedBlackMenuBar from "./RedBlackMenuBar";
import { useTranslation } from "react-i18next";
import { treeActions, treeSelectors } from "../store/tree";

export default function RedBlackEditBar({onAddMany, selectedNode, onSelectedChanged}){
    const { t: translate } = useTranslation("red_black");
    const dispatch = useDispatch();

    const realLength = useSelector(treeSelectors.getRealLength);
    const rootIndex = useSelector(treeSelectors.getRootIndex);
    const replacedIndex = useSelector((state) => {
        treeSelectors.getClosestReplacement(state, selectedNode);
    })
    
    const handleAdd = (value) => {
        const result = dispatch(treeActions.add({value:value}));
        onSelectedChanged(result.payload.index);
    }

    const handleRemove = () => {
        if(rootIndex === -1) return;
        dispatch(treeActions.removeIndex({index:selectedNode}));
        setSelectedNode(replacedIndex);
    }
    
    const handleClear = () => {
        if(rootIndex === -1) return;
        dispatch(treeActions.clear());
    }

    return <RedBlackMenuBar>
        <div>
            <FieldButton onClick={handleAdd}>+</FieldButton>
            <MenuButton onClick={onAddMany}>+100,000</MenuButton>
        </div>
        <div>
            <MenuButton onClick={handleRemove} disabled={selectedNode === -1}>{translate("remove_node")}</MenuButton>
            <MenuButton onClick={handleClear} dim disabled={realLength <= 0}>{translate("clear_all_nodes")}</MenuButton>
        </div>
    </RedBlackMenuBar>
}