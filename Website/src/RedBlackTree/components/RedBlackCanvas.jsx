import LineBetween from "./LineBetween";
import RedBlackNodeElement from "./RedBlackNodeElement";

export default function RedBlackCanvas({ nodes, nodesToShow, rootIndex, selectedNode, onNodeClicked, centerX, topY, changeX, changeY }) {

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
        addRenderNodes(nodesToShow[0], centerX-changeX, topY, changeX, changeY, onNodeClicked, 4, nodeElements, nodes, selectedNode, leftChild, parentIndex);
    }
  
    return <div >
            {nodeElements}
        </div>
  }
  

function addRenderNodes(baseIndex, previousX, previousY, changeX, changeY, onNodeClicked, depth, elements, nodes, selectedNode, leftChild, parentId){
    let baseNode = nodes[baseIndex];
    const newX = previousX + changeX;
    const newY = previousY + changeY;
    if(!baseNode){
        elements.push(<RedBlackNodeElement key={`${leftChild}-${parentId}`} x={newX} y={newY} originX={previousX} originY={previousY} value={""} isSmall/>);//need better key, for that need to know parent and if left or right null child
        return;
    }
    if(depth <= 0) return;//when hitting depth, would like something indicating how many children are down there
    elements.push(<RedBlackNodeElement key={baseNode.id} onClick={() => onNodeClicked(baseIndex)} x={newX} y={newY} value={baseNode.value} isRed={baseNode.isRed} selected={baseIndex === selectedNode}/>);
    let leftChangeX = -Math.abs(changeX/2);
    let rightChangeX = Math.abs(changeX/2);
    elements.push(<LineBetween key={baseNode.id+"-toleft"} toPoint={{x:newX+leftChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    elements.push(<LineBetween key={baseNode.id+"-toright"} toPoint={{x:newX+rightChangeX, y:newY+changeY}} fromPoint={{x:newX, y:newY}}/>);
    addRenderNodes(baseNode.left, newX, newY, leftChangeX, changeY, onNodeClicked, depth-1, elements, nodes, selectedNode, true, baseNode.id);
    addRenderNodes(baseNode.right, newX, newY, rightChangeX, changeY, onNodeClicked, depth-1, elements, nodes, selectedNode, false, baseNode.id);

}