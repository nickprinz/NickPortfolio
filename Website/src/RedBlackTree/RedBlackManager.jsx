
import {useSelector, useDispatch} from "react-redux";
import { treeActions } from "./store/tree";
import RedBlackContainer from "./RedBlackContainer";
import RedBlackNodeElement from "./RedBlackNodeElement";
import LineBetween from "./LineBetween";
import MenuButton from "./MenuButton";


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function RedBlackManager({}){
    const dispatch = useDispatch();
    const { nodes, rootIndex } = useSelector(state => {
        return state.tree;
    });
    console.log(nodes.length)
    const handleAdd = function(){
        console.log("add")
        dispatch(treeActions.add({value:getRandomInt(0,1000)}));
    }
    const handleRemove = function(){
        console.log("remove")
        if(rootIndex === -1) return;
        dispatch(treeActions.removeIndex({index:rootIndex}));
    }

    return <>
        <RedBlackContainer>
            <div className="flex gap-x-6 px-10 justify-between bg-zinc-800">
                <MenuButton onClick={handleAdd}>Add Value</MenuButton>
                <MenuButton onClick={handleRemove}>Remove</MenuButton>
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