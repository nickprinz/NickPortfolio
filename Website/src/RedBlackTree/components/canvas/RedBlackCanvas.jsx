import { useSelector } from "react-redux";
import ExteriorNodeElement from "./ExteriorNodeElement";
import LineBetween from "./LineBetween";
import RedBlackNodeElement from "./RedBlackNodeElement";
import { getTreeSection } from "../../store/treeHelper";

export default function RedBlackCanvas({ selectedIndex, onNodeClicked, width, height }) {
    const centerX = width/2;
    const changeY = height/8;
    const changeX = (width-30)/2;
    const topY = 50;
    const tree = useSelector(state => {
        return state.tree;
    });
    const { nodes, rootIndex } = tree;
    let focusedIndex = selectedIndex;
    const activeHistoryStep = getActiveHistoryStep(tree);
    if(activeHistoryStep){
        if(activeHistoryStep.type === "compare"){
            focusedIndex = activeHistoryStep.secondaryIndex;
        }
    }

    //getTreeSection probably doesn't below in the tree
    //also need a better tree section. when showing the root, current behavior is fine
    //want to try to center the selected node better, which could be done when farther on the tree by not showing the cousin's children
    //removing that layer would allow the uncle's tree to take up less space, which could push the selected node closer to center
    const nodesToShow = getTreeSection(focusedIndex === -1 ? rootIndex : focusedIndex , 2, 4, tree);

    const nodeElements = [];
    if(nodes.length > 0){
        //if top node is not root it needs a line up
        let leftChild = true;
        let parentIndex = -1;
        if(nodesToShow[0] !== rootIndex){
            let topNode = nodes[nodesToShow[0]];
            let firstParent = nodes[topNode.parent];
            parentIndex = firstParent.index;
            //should also add node indicating how many things are up there
            if(firstParent.left == topNode.index){
                nodeElements.push(<LineBetween key={firstParent.id+"-toLeft"} fromPoint={{x:centerX, y:topY+changeY-10}} toPoint={{x:centerX+(changeX/2), y:20}}/>);
            }
            else{
                leftChild = false;
                nodeElements.push(<LineBetween key={firstParent.id+"-toRight"} fromPoint={{x:centerX, y:topY+changeY-10}} toPoint={{x:centerX-(changeX/2), y:20}}/>);
            }
        }

        //right now hardcode a center at 430, 300
        addRenderNodes(nodesToShow[0], centerX-changeX, topY, changeX, changeY, onNodeClicked, 4, nodeElements, nodes, focusedIndex, leftChild, parentIndex);
    }
  
    return <div >
            {nodeElements}
        </div>
}

function getActiveHistoryStep(tree){
    const activeAction = tree.history[tree.currentHistoryAction];
    if(!activeAction) return null;
    const activeStep = activeAction.steps[tree.currentHistoryStep];
    return activeStep;

}

function getDisplaySection(focusedIndex, nodes, rootIndex){
    let focusedNode = nodes[focusedIndex];
    //for all the below cases, need to figure out how to position on the x axis
    //want to have focused node as centered as possible
    //right now the width can be considered 4, with a line from root be 1

    //root is already centered

    //child root will now have 1 less level on the sibling side
    //if x moves based on how many more levels down, that will free up sibling side from need 2 to 1, with another 1 from root to focus to allow perfect center

    //for a right-right child, it is currently positioned at 3.5
    //if I remove 2 levels from the uncle side it will need .5 instead of 2, which would allow the focus to move over to 2

    //a total of 6 possible heights
    //root/grandparent sits at 2, with an off chart node at 1 if something is above that
    //focused child of root sits at 3, other focused sit at 4
    //5 is the last full level of children, 6 is off chart node if not null

    if(focusedIndex === rootIndex){
        //root case, show all children 3 levels down 
    } else if(focusedNode.parent === rootIndex){
        //child root case, show 2 levels down, parent, sibling, and sibling children
    } else{
        //down at least 2 levels, show up to parent and over to uncle. also show children and nephews
    }
}

function addRenderNodes(baseIndex, previousX, previousY, changeX, changeY, onNodeClicked, depth, elements, nodes, selectedNode, leftChild, parentId){
    let baseNode = nodes[baseIndex];
    const newX = previousX + changeX;
    const newY = previousY + changeY;
    if(!baseNode){
        elements.push(<RedBlackNodeElement key={`${leftChild}-${parentId}`} x={newX} y={newY} originX={previousX} originY={previousY} value={""} isSmall/>);//need better key, for that need to know parent and if left or right null child
        return;
    }
    if(depth <= 0) {
        elements.push(<ExteriorNodeElement key={baseNode.id} x={newX} y={newY} originX={previousX} originY={previousY} childCount={baseNode.childCount+1} depth={baseNode.depthBelow+1} onClick={() => onNodeClicked(baseIndex)} />)
        //baseNode.childCount;
        //baseNode.depthBelow;
        return;
    }
    elements.push(<RedBlackNodeElement key={baseNode.id} onClick={() => onNodeClicked(baseIndex)} x={newX} y={newY} value={baseNode.value} isRed={baseNode.isRed} selected={baseIndex === selectedNode}/>);
    let leftChangeX = -Math.abs(changeX/2);
    let rightChangeX = Math.abs(changeX/2);
    elements.push(<LineBetween key={baseNode.id+"-toleft"} toPoint={{x:newX+leftChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    elements.push(<LineBetween key={baseNode.id+"-toright"} toPoint={{x:newX+rightChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    addRenderNodes(baseNode.left, newX, newY, leftChangeX, changeY, onNodeClicked, depth-1, elements, nodes, selectedNode, true, baseNode.id);
    addRenderNodes(baseNode.right, newX, newY, rightChangeX, changeY, onNodeClicked, depth-1, elements, nodes, selectedNode, false, baseNode.id);

}