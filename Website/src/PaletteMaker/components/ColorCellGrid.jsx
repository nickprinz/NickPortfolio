
import ColorCell from "./ColorCell";
import { useDispatch, useSelector } from "react-redux";
import { paletteActions, paletteSelectors } from "../store/palette";

export default function ColorCellGrid(){
    const gridWidth = 50;
    const gridHeight = 30;

    const rowCount = useSelector(paletteSelectors.getGridRowCount);
    const columnCount = useSelector(paletteSelectors.getColumnCount);
    const dispatch = useDispatch();

    const onHueShiftClick = (rowNum) => {
        dispatch(paletteActions.setHueShiftDirection(rowNum));
    }

    return <div className="m-4 relative" style={{width:(gridWidth+"rem"), height:(gridHeight+"rem")}}>
        {colorsToCells(rowCount, columnCount, gridWidth, gridHeight, onHueShiftClick)}
    </div>
}

let colorsToCells = (rowCount, columnCount, gridWidth, gridHeight, onHueShiftClick) => {
    if(rowCount === 0 || columnCount === 0) return [];
    let width = gridWidth / columnCount;
    let height = gridHeight / rowCount;
    const cells = [];
    for (let i = 0; i < rowCount; i++) {
        const yPos = i*height;
        for (let j = 0; j < columnCount; j++) {
            const xPos = (j*width)-.1;
            cells.push(<ColorCell key={`key${i}-${j}`} row={i} column={j} position={{X:xPos, Y:yPos}} size={{X:(width+.1), Y:height}} ></ColorCell>);
        }
        cells.push(<div 
            key={`hue-${i}`}
            className="absolute cursor-pointer flex bg-white size-6" 
            style={{left: "-4rem", top: `${yPos}rem`}} 
            onClick={() => onHueShiftClick(i)}>
            </div>);
    }

    return cells;
}