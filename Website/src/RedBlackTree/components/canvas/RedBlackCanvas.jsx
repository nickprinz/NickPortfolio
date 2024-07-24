import { useSelector } from "react-redux";
import ExteriorNodeElement from "./ExteriorNodeElement";
import LineBetween from "./LineBetween";
import RedBlackNodeElement from "./RedBlackNodeElement";
import { CanvasPositioner } from "./nodePositionHelper";
import { treeSelectors } from "../../store/tree";
import NoteText from "./NoteText";
import { AnimatePresence } from "framer-motion";

export default function RedBlackCanvas({ selectedIndex, onNodeClicked, width, height }) {
    let focusedIndex = useSelector(treeSelectors.selectHistoryFocusedIndex);
    if(focusedIndex === null) focusedIndex = selectedIndex;
    let stepNote = useSelector(treeSelectors.selectActiveHistoryStepNote);

    const positioners = useSelector((state) => treeSelectors.selectDisplaySection(state, focusedIndex));
    const canvasPositioner = new CanvasPositioner(width, height);

    let noteOnRight = true;
    positioners.forEach(x => {
        if(x.y === 1 && x.x > 0){
            noteOnRight = false
        }
    })
    return <div className="overflow-hidden" >
            <AnimatePresence>{stepNote && stepNote.note && <NoteText text={stepNote.note} noteValues={stepNote.values} onRight={noteOnRight} width={width/2.4} height={height/6.2}></NoteText>}</AnimatePresence>
            {renderPositioners(positioners, canvasPositioner, focusedIndex, onNodeClicked)}
        </div>
}

function renderPositioners(positioners, canvasPositioner, focusedIndex, onNodeClicked){
    const elements = [];

    positioners.forEach(positioner => {
        let canvasPoint = canvasPositioner.toCanvasSpace(positioner);
        if(positioner.value === null){
            elements.push(<RedBlackNodeElement key={positioner.id} x={canvasPoint.x} y={canvasPoint.y} value={""} isSmall/>)
            return;
        }
        elements.push(...renderLines(positioner, canvasPositioner));
        if(positioner.isOut){
            elements.push(<ExteriorNodeElement key={positioner.id} onClick={() => onNodeClicked(positioner.index)} x={canvasPoint.x} y={canvasPoint.y} childCount={positioner.childCount} depth={positioner.depthBelow} />);
            return;
        }
        elements.push(<RedBlackNodeElement key={positioner.id} onClick={() => onNodeClicked(positioner.index)} x={canvasPoint.x} y={canvasPoint.y} value={positioner.value} isRed={positioner.isRed} selected={positioner.index === focusedIndex}/>);
        
    });

    return elements;
}

function renderLines(positioner, canvasPositioner){
    return positioner.linesTo.map(line => {
        return <LineBetween key={`${positioner.id}-${line.key}`} fromPoint={canvasPositioner.toCanvasSpace(positioner)} toPoint={canvasPositioner.toCanvasSpace(line)}/>
    });
}