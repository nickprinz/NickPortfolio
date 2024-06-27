
import { useState } from "react";
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "./store/tree";
import { getClosestReplacement} from "./store/treeHelper"
import RedBlackContainer from "./RedBlackContainer";
import RedBlackNodeCanvas from "./components/canvas/RedBlackCanvas";
import { useDistibuted } from "./hooks/useDistributed";
import AddMultipleNodesModal from "./components/AddMultipleNodesModal";
import RedBlackEditBar from "./components/RedBlackEditBar";
import RedBlackHistoryBar from "./components/history/RedBlackHistoryBar";
import MenuTab from "./components/MenuTab";
import MenuTabBar from "./components/MenuTabBar";

const LARGE_ADD_TOTAL = 100000;
const LARGE_ADD_ITERATIONS = 10;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function RedBlackManager({}){
    const dispatch = useDispatch();
    const [selectedNode, setSelectedNode] = useState(-1);
    const [activeTab, setActiveTab] = useState(0);
    const [isDistributing, distCount, beginDistributing] = useDistibuted();
    const tree = useSelector(state => {
        return state.tree;
    });
    const { nodes, rootIndex, freeIndexes } = tree;
    
    const realLength = nodes.length - freeIndexes.length;
    const handleAdd = (value) => {
        const result = dispatch(treeActions.add({value:value}));
        setSelectedNode(result.payload.index);
    }
    
    const handleAddMany = async () => {

        beginDistributing(() => {
            let values = [];
            for (let index = 0; index < LARGE_ADD_TOTAL/LARGE_ADD_ITERATIONS; index++) {
                values.push(getRandomInt(0,1000000));
            }
            dispatch(treeActions.add({value:values}));

        },LARGE_ADD_ITERATIONS,50,700);
    }
    const handleRemove = () => {
        if(rootIndex === -1) return;
        const replacedIndex = getClosestReplacement(selectedNode, tree);
        dispatch(treeActions.removeIndex({index:selectedNode}));
        setSelectedNode(replacedIndex);
    }
    const handleClear = () => {
        if(rootIndex === -1) return;
        dispatch(treeActions.clear());
    }

    const onNodeClicked = (clickedIndex) => {
        setSelectedNode(clickedIndex);
    }

    const onTabClicked = (name,index) => {
        setActiveTab(index);
    }

    const handleHistoryBack = () => {
        dispatch(treeActions.moveHistory({amount:-1}));
    }

    return <>
        <AddMultipleNodesModal open={isDistributing} max={LARGE_ADD_ITERATIONS} value={distCount} />
        <RedBlackContainer>
            <MenuTabBar activeIndex={activeTab} tabNames={["Edit","History"]} onTabClicked={onTabClicked}/>
            {activeTab === 0 && <RedBlackEditBar onAdd={handleAdd} onAddMany={handleAddMany} onRemove={handleRemove} onClear={handleClear} selectedNode={selectedNode} realLength={realLength}/>}
            {activeTab === 1 && <RedBlackHistoryBar onHistoryBack={handleHistoryBack} />}
            <div className="relative">
                <RedBlackNodeCanvas selectedNode={selectedNode} onNodeClicked={onNodeClicked} centerX={420} topY={50} changeX={400} changeY={70}/>
            </div>
        </RedBlackContainer>
    </>
}