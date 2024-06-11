
import { useState } from "react";
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "./store/tree";
import {getTreeSection, getClosestReplacement} from "./store/treeHelper"
import RedBlackContainer from "./RedBlackContainer";
import RedBlackNodeElement from "./RedBlackNodeElement";
import LineBetween from "./LineBetween";
import MenuButton from "./components/MenuButton";
import FieldButton from "./components/FieldButton";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function RedBlackManager({}){
    const dispatch = useDispatch();
    const [selectedNode, setSelectedNode] = useState(-1);
    const { nodes, rootIndex, freeIndexes } = useSelector(state => {
        return state.tree;
    });
    
    const realLength = nodes.length - freeIndexes.length;
    const handleAdd = function(value){
        dispatch(treeActions.add({value:value}));
    }
    const handleAddMany = function(){
        let values = [];
        for (let index = 0; index < 100000; index++) {
            values.push(getRandomInt(0,1000000));
        }
        dispatch(treeActions.add({value:values}));
    }
    const handleRemove = function(){
        if(rootIndex === -1) return;
        const replacedIndex = getClosestReplacement(selectedNode, nodes);
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

    const nodesToShow = getTreeSection(selectedNode === -1 ? rootIndex : selectedNode , 2, 4, nodes);

    const nodeElements = [];
    if(nodes.length > 0){
        //if top node is not root it needs a line up
        if(nodesToShow[0] !== rootIndex){
            let topNode = nodes[nodesToShow[0]];
            let firstParent = nodes[topNode.parent];
            //should also add node indicating how many things are up there
            if(firstParent.left == topNode.index){
                nodeElements.push(<LineBetween key={firstParent.index+"-toLeft"} toPoint={{x:430, y:70}} fromPoint={{x:430+200, y:20}}/>);
            }
            else{
                nodeElements.push(<LineBetween key={firstParent.index+"-toRight"} toPoint={{x:430, y:70}} fromPoint={{x:430-200, y:20}}/>);
            }
        }

        addRenderNodes(nodesToShow[0], 30, 10, 400, 70, onNodeClicked, 4, nodeElements, nodes, selectedNode);
    }

    //right now hardcode a center at 430, 300

    return <>
        <RedBlackContainer>
            <div className="bg-zinc-950">
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
                    {nodeElements}
                </div>
            </div>
        </RedBlackContainer>
    </>
    
}

function addRenderNodes(baseIndex, previousX, previousY, changeX, changeY, onNodeClicked, depth, elements, nodes, selectedNode){
    let baseNode = nodes[baseIndex];
    const newX = previousX + changeX;
    const newY = previousY + changeY;
    if(!baseNode){
        elements.push(<RedBlackNodeElement key={newX + "-" + newY} x={newX} y={newY} value={""} isSmall/>);//need better key, for that need to know parent and if left or right null child
        return;
    }
    if(depth <= 0) return;//when hitting depth, would like something indicating how many children are down there
    elements.push(<RedBlackNodeElement key={baseIndex} onClick={() => onNodeClicked(baseIndex)} x={newX} y={newY} value={baseNode.value} isRed={baseNode.isRed} selected={baseIndex === selectedNode}/>);
    let leftChangeX = -Math.abs(changeX/2);
    let rightChangeX = Math.abs(changeX/2);
    elements.push(<LineBetween key={baseIndex+"-toleft"} toPoint={{x:newX+leftChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    elements.push(<LineBetween key={baseIndex+"-toright"} toPoint={{x:newX+rightChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    addRenderNodes(baseNode.left, newX, newY, leftChangeX, changeY, onNodeClicked, depth-1, elements, nodes, selectedNode);
    addRenderNodes(baseNode.right, newX, newY, rightChangeX, changeY, onNodeClicked, depth-1, elements, nodes, selectedNode);


}