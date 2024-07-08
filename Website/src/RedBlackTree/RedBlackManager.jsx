
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { treeActions } from "./store/tree";
import RedBlackContainer from "./RedBlackContainer";
import RedBlackCanvas from "./components/canvas/RedBlackCanvas";
import { useDistibuted } from "./hooks/useDistributed";
import AddMultipleNodesModal from "./components/AddMultipleNodesModal";
import RedBlackEditBar from "./components/RedBlackEditBar";
import RedBlackHistoryBar from "./components/history/HistoryBar";
import MenuTabBar from "./components/MenuTabBar";
import { useTranslation } from "react-i18next";

const LARGE_ADD_TOTAL = 100000;
const LARGE_ADD_ITERATIONS = 10;
const containerHeight = 580;
const containerWidth = 860;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function RedBlackManager({}){
    const { t: translate } = useTranslation("red_black");
    const dispatch = useDispatch();
    const [selectedNode, setSelectedNode] = useState(-1);
    const [activeTab, setActiveTab] = useState(0);
    const [isDistributing, distCount, beginDistributing] = useDistibuted();

    const handleSelectedChanged = useCallback((clickedIndex) => {
        setSelectedNode(clickedIndex);
    },[])
    
    const handleAddMany = async () => {

        beginDistributing(() => {
            let values = [];
            for (let index = 0; index < LARGE_ADD_TOTAL/LARGE_ADD_ITERATIONS; index++) {
                values.push(getRandomInt(0,1000000));
            }
            const result = dispatch(treeActions.add({value:values}));
            setSelectedNode(result.payload.index);

        },LARGE_ADD_ITERATIONS,50,700);
    }

    const onTabClicked = (name,index) => {
        setActiveTab(index);
        dispatch(treeActions.moveHistoryCurrent({}));
    }

    return <>
        <AddMultipleNodesModal open={isDistributing} max={LARGE_ADD_ITERATIONS} value={distCount} />
        <RedBlackContainer width={containerWidth} height={containerHeight}>
            <MenuTabBar activeIndex={activeTab} tabNames={[translate("edit_tab"),translate("history_tab")]} onTabClicked={onTabClicked}/>
            {activeTab === 0 && <RedBlackEditBar onAddMany={handleAddMany} selectedNode={selectedNode} onSelectedChanged={handleSelectedChanged}/>}
            {activeTab === 1 && <RedBlackHistoryBar />}
            <div className="relative">
                <RedBlackCanvas selectedIndex={selectedNode} onNodeClicked={handleSelectedChanged} width={containerWidth-22} height={containerHeight-20}/>
            </div>
        </RedBlackContainer>
    </>
}