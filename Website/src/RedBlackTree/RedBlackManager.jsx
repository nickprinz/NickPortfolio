
import { useState } from "react";
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "./store/tree";
import { getClosestReplacement} from "./store/treeHelper"
import RedBlackContainer from "./RedBlackContainer";
import RedBlackNodeCanvas from "./components/RedBlackCanvas";
import MenuButton from "./components/MenuButton";
import FieldButton from "./components/FieldButton";
import { useDistibuted } from "./hooks/useDistributed";
import AddMultipleNodesModal from "./components/AddMultipleNodesModal";

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
    const handleAdd = function(value){
        dispatch(treeActions.add({value:value}));//I would like to get the newly inserted node so it can be selected immediately. having a history will probably solve that
    }
    const handleAddMany = async function(){

        beginDistributing(() => {
            let values = [];
            for (let index = 0; index < LARGE_ADD_TOTAL/LARGE_ADD_ITERATIONS; index++) {
                values.push(getRandomInt(0,1000000));
            }
            dispatch(treeActions.add({value:values}));

        },LARGE_ADD_ITERATIONS,50,700);
    }
    const handleRemove = function(){
        if(rootIndex === -1) return;
        const replacedIndex = getClosestReplacement(selectedNode, tree);
        dispatch(treeActions.removeIndex({index:selectedNode}));
        setSelectedNode(replacedIndex);
    }
    const handleClear = function(){
        if(rootIndex === -1) return;
        dispatch(treeActions.clear());
    }

    const onNodeClicked = function(clickedIndex){
        setSelectedNode(clickedIndex);
    }

    return <>
        <AddMultipleNodesModal open={isDistributing} max={LARGE_ADD_ITERATIONS} value={distCount} />
        <RedBlackContainer>
            <div className="flex gap-x-6 px-4 justify-between bg-zinc-800 rounded-t-md">
                <div>
                    <FieldButton onClick={handleAdd}>Insert Number</FieldButton>
                    <MenuButton onClick={handleAddMany}>+100,000</MenuButton>
                </div>
                <div>
                    <MenuButton onClick={handleRemove} disabled={selectedNode === -1}>Remove</MenuButton>
                    <MenuButton onClick={handleClear} dim disabled={realLength <= 0}>Clear All</MenuButton>
                </div>
            </div>
            <div className="relative">
                <RedBlackNodeCanvas selectedNode={selectedNode} onNodeClicked={onNodeClicked} centerX={420} topY={50} changeX={400} changeY={70}/>
            </div>
        </RedBlackContainer>
    </>
}