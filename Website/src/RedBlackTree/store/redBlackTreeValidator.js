export default function validateTree(tree) {

    const violations = []
    const validResult = {isValid: true, firstBlackDepth: 0, violations:violations};
    const blackDepths = [];

    if(tree.rootIndex === -1){
        return  validResult;
    }

    checkNode(tree.nodes[tree.rootIndex], 0, blackDepths, violations, tree);

    if(blackDepths.length > 0) validResult.firstBlackDepth = blackDepths[0];
    if(violations.length > 0) validResult.isValid = false;
    
    return validResult;
}

function checkNode(node, currentBlackDepth, blackDepths, violations, tree){
    if(!node.isRed){
        currentBlackDepth++;
    }

    let leftNode = validateChild(node, true, currentBlackDepth, blackDepths, violations, tree);
    if(leftNode) checkNode(leftNode, currentBlackDepth, blackDepths, violations, tree);

    let rightNode = validateChild(node, false, currentBlackDepth, blackDepths, violations, tree);
    if(rightNode) checkNode(rightNode, currentBlackDepth, blackDepths, violations, tree);

}

function validateChild(node, isLeft, currentBlackDepth, blackDepths, violations, tree){
    let childNode = tree.nodes[(isLeft ? node.left : node.right)];
    if(childNode && childNode.isRed && node.isRed){
        violations.push(`red-red at ${node.index} to ${childNode.index}`);
    }
    logFinishedDepth(node, isLeft, currentBlackDepth, blackDepths, violations);
    return childNode;
}

function logFinishedDepth(node, isLeft, currentBlackDepth, blackDepths, violations){
    const resultDepth = currentBlackDepth+1;
    if(blackDepths.length > 0 && blackDepths[0] !== resultDepth){
        violations.push(`black depth at ${node.index} to ${isLeft ? "left" : "right"}`);
    }
    blackDepths.push(resultDepth);
}