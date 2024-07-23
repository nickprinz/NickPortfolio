export default function selectTextForHistoryStep(actions, nodes, actionIndex, stepIndex){//use actionId to keep a consistent key
    const result = {textkey:"" , params:{}};
    const action = actions[actionIndex];
    if(!action) return result;
    const step = action.steps[stepIndex];
    if(!step){
        result.textkey = "finished";
        return result;
    }
    
    if(step.type === "compare"){
        result.textkey = "compare_values";
        const node1 = nodes[step.primaryIndex];
        const node2 = nodes[step.secondaryIndex];
        result.params = {value1: node1.value, value2: node2.value};
        return result;
    }
    
    if(step.type === "swap"){
        //swap exposes a problem. swaps make recorded indexes unreliable
        //I might need to change swap so relationship indexes get changed but a node keeps its index
        result.textkey = "swap_nodes";
        const node1 = nodes[step.primaryIndex];
        const node2 = nodes[step.secondaryIndex];
        result.params = {value1: node1.value, value2: node2.value};
        return result;
    }

    if(step.type === "change"){
        if(step.attribute === "root"){
            result.textkey = "set_root";
            const node1 = nodes[step.oldValue];
            const node2 = nodes[step.value];
            result.params = {value1: node1 ? node1.value : "empty", value2: node2 ? node2.value : "empty"};
            return result;
        }
        const node = nodes[step.index];
        result.params = {value: node.value};
        if(step.attribute === "rotateRight"){
            result.textkey = "rotate_right";
            if(step.value){
                result.textkey += "_color_swap";
            }
            return result;
        }
        if(step.attribute === "rotateLeft"){
            result.textkey = "rotate_left";
            if(step.value){
                result.textkey += "_color_swap";
            }
            return result;
        }
        if(step.attribute === "parent"){
            result.textkey = "set_parent";
            const parentNode = nodes[step.value];
            result.params.parent = parentNode ? parentNode.value : "empty";//actually need a new text key if empty
            return result;
        }
        if(step.attribute === "isRed"){
            result.textkey = step.value ? "set_red" : "set_black";
            return result;
        }
        result.textkey = step.attribute;
        return result;

    }
    result.textkey = step.type;
    return result;
}