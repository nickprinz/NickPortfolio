export default function validateTree(tree) {

    const violations = []
    const validResult = {isValid: true, firstBlackDepth: 0, violations:violations};
    const blackDepths = [];

    if(tree.rootIndex === -1){
        return  validResult;
    }

    checkNode(tree.nodes[tree.rootIndex], 0, blackDepths, undefined, undefined, violations, tree);

    if(blackDepths.length > 0) validResult.firstBlackDepth = blackDepths[0];
    if(violations.length > 0) validResult.isValid = false;
    
    return validResult;
}

function checkNode(node, currentBlackDepth, blackDepths, minValue, maxValue, violations, tree){
    if(!node.isRed){
        currentBlackDepth++;
    }

    let leftNode = validateChild(node, true, currentBlackDepth, blackDepths, minValue, node.value, violations, tree);
    if(leftNode) checkNode(leftNode, currentBlackDepth, blackDepths, minValue, node.value, violations, tree);

    let rightNode = validateChild(node, false, currentBlackDepth, blackDepths, node.value, maxValue, violations, tree);
    if(rightNode) checkNode(rightNode, currentBlackDepth, blackDepths, node.value, maxValue, violations, tree);

}

function validateChild(node, isLeft, currentBlackDepth, blackDepths, minValue, maxValue, violations, tree){
    let childNode = tree.nodes[(isLeft ? node.left : node.right)];
    if(childNode && childNode.isRed && node.isRed){
        violations.push(`red-red at ${node.index} to ${childNode.index}`);
    }
    if(!childNode){
        logFinishedDepth(node, isLeft, currentBlackDepth, blackDepths, violations);
    } else{
        if(childNode.parent !== node.index){
            violations.push(`child does not list its correct parent at ${node.index} to ${childNode.index}`);
        }
        validateChildValue(childNode, minValue, maxValue, violations);
    }
    return childNode;
}

function logFinishedDepth(node, isLeft, currentBlackDepth, blackDepths, violations){
    const resultDepth = currentBlackDepth+1;
    if(blackDepths.length > 0 && blackDepths[0] !== resultDepth){
        violations.push(`black depth at ${node.index} to ${isLeft ? "left" : "right"}`);
    }
    blackDepths.push(resultDepth);
}

function validateChildValue(node, minValue, maxValue, violations){
    if(node.parent === -1) return;

    if(minValue !== undefined && node.value < minValue){
        violations.push(`incorrect value ${node.value}, should be >= ${minValue} at ${node.index} to parent ${node.parent}`);
    }

    if(maxValue !== undefined && node.value > maxValue){
        violations.push(`incorrect value ${node.value}, should be <= ${maxValue} at ${node.index} to parent ${node.parent}`);
    }
}