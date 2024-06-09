
import {useSelector, useDispatch,} from "react-redux";
import { treeActions } from "./store/tree";
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
                <RedBlackNodeElement x={120} y={40} value="623"/>
                <RedBlackNodeElement x={40} y={100} value="5"/>
                <LineBetween toPoint={{x:40, y:100}} fromPoint={{x:120, y:40}}/>
                
                <RedBlackNodeElement x={220} y={200} value="1234567"/>
                <RedBlackNodeElement x={40} y={200} value="2345678"/>
                <LineBetween toPoint={{x:220, y:200}} fromPoint={{x:40, y:200}}/>
                
                <RedBlackNodeElement x={500} y={100} value="23456"/>
                <RedBlackNodeElement x={500} y={200} value="2345678901234"/>
                <LineBetween toPoint={{x:500, y:100}} fromPoint={{x:500, y:200}}/>
            </div>
        </RedBlackContainer>
    </>
    
}