export default function selectTextForHistoryAction(action){
    const result = {textkey:"" , params:{}};
    if(!action){
        result.textkey = "now_history";
        return result;
    }
    
    result.textkey = getTextKey(action.name);
    result.params = {value: action.value};
    return result;
}

const getTextKey = (actionName) => {
    switch (actionName) {
        case "add":
            return "add_history";
        case "remove":
            return "remove_history";
        default:
            break;
    }
}