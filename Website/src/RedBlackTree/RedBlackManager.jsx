
import { useState } from "react";
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "./store/tree";
import { getClosestReplacement} from "./store/treeHelper"
import RedBlackContainer from "./RedBlackContainer";
import RedBlackNodeCanvas from "./components/RedBlackCanvas";
import { useDistibuted } from "./hooks/useDistributed";
import AddMultipleNodesModal from "./components/AddMultipleNodesModal";
import RedBlackEditBar from "./components/RedBlackEditBar";
import RedBlackHistoryBar from "./components/RedBlackHistoryBar";
import MenuTab from "./components/MenuTab";

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
    const [isDistributing, distCount, beginDistributing] = useDistibuted();
    const tree = useSelector(state => {
        return state.tree;
    });
    const { nodes, rootIndex, freeIndexes } = tree;
    
    const realLength = nodes.length - freeIndexes.length;
    const handleAdd = (value) => {
        dispatch(treeActions.add({value:value}));//I would like to get the newly inserted node so it can be selected immediately. having a history will probably solve that
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

    return <>
        <AddMultipleNodesModal open={isDistributing} max={LARGE_ADD_ITERATIONS} value={distCount} />
        <RedBlackContainer>
            <div><MenuTab text={"Edit"}/><MenuTab text={"History"} dim/></div>
            <RedBlackHistoryBar />
            <RedBlackEditBar onAdd={handleAdd} onAddMany={handleAddMany} onRemove={handleRemove} onClear={handleClear} selectedNode={selectedNode} realLength={realLength}/>
            <div className="relative">
                <RedBlackNodeCanvas selectedNode={selectedNode} onNodeClicked={onNodeClicked} centerX={420} topY={50} changeX={400} changeY={70}/>
            </div>
        </RedBlackContainer>
    </>
}