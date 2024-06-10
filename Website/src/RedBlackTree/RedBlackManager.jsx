
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "./store/tree";
import {getTreeSection} from "./store/treeHelper"
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
        dispatch(treeActions.removeIndex({index:rootIndex}));
    }
    const handleClear = function(){
        if(rootIndex === -1) return;
        dispatch(treeActions.clear());
    }

    const onNodeClicked = function(clickedIndex){
        console.log(clickedIndex);
    }

    const nodesToShow = getTreeSection(0,1, nodes);

    const nodeElements = [];
    if(nodes.length > 0){
        addRenderNodes(rootIndex, 30, 10, 400, 70, onNodeClicked, nodeElements, nodes);
    }

    //right now hardcode a center at 430, 300

    return <>
        <RedBlackContainer>
            <div className="flex gap-x-6 px-4 justify-between bg-zinc-800">
                <div>
                    <FieldButton onClick={handleAdd}>Insert Number</FieldButton>
                    <MenuButton onClick={handleAddMany}>+100,000</MenuButton>
                </div>
                <div>
                    <MenuButton onClick={handleRemove} disabled>Remove</MenuButton>
                    <MenuButton onClick={handleClear} dim disabled={realLength <= 0}>Clear All</MenuButton>
                </div>
            </div>
            <div className="relative">
                {nodeElements}
            </div>
        </RedBlackContainer>
    </>
    
}

function addRenderNodes(baseIndex, previousX, previousY, changeX, changeY, onNodeClicked, elements, nodes){
    let baseNode = nodes[baseIndex];
    const newX = previousX + changeX;
    const newY = previousY + changeY;
    if(!baseNode){
        elements.push(<RedBlackNodeElement key={newX + "-" + newY} x={newX} y={newY} value={""} isSmall/>);//change to small black
        return;
    }
    if(elements.length > 200) return;
    elements.push(<RedBlackNodeElement key={baseIndex} onClick={() => onNodeClicked(baseIndex)} x={newX} y={newY} value={baseNode.value} isRed={baseNode.isRed}/>);
    let leftChangeX = -Math.abs(changeX/2);
    let rightChangeX = Math.abs(changeX/2);
    elements.push(<LineBetween key={baseIndex+"-toleft"} toPoint={{x:newX+leftChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    elements.push(<LineBetween key={baseIndex+"-toright"} toPoint={{x:newX+rightChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    addRenderNodes(baseNode.left, newX, newY, leftChangeX, changeY, onNodeClicked, elements, nodes);
    addRenderNodes(baseNode.right, newX, newY, rightChangeX, changeY, onNodeClicked, elements, nodes);


}