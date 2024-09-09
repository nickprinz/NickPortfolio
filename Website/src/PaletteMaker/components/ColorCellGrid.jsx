import { useState } from "react";
import ColorCell from "./ColorCell";
import { useSelector } from "react-redux";
import { paletteSelectors } from "../store/palette";

export default function ColorCellGrid(){

    let [selectedId, setSelected] = useState(null);

    let gridWidth = 50;
    let gridHeight = 30;

    let colors = useSelector(paletteSelectors.selectStuff);

    let handleCellClicked = (cellId) => {
        if(selectedId === cellId){
            setSelected(-1);
            return;
        }
        setSelected(cellId);
    }

    return <div className="m-4 relative" style={{width:(gridWidth+"rem"), height:(gridHeight+"rem")}}>
        {colorsToCells(colors, selectedId, gridWidth, gridHeight, handleCellClicked)}
    </div>
}

let colorsToCells = (colors, selectedId, gridWidth, gridHeight, handleCellClicked) => {
    if(colors.length === 0 || colors[0].length === 0) return [];
    let width = gridWidth / colors[0].length;
    let height = gridHeight / colors.length;
    
    let cells = colors.map((row, j) => {
        return row.map((color, i) => {
            let id = `${i}:${j}`;
            return <ColorCell key={id} id={id} position={{X:i*width, Y:j*height}} size={{X:width, Y:height}} color={color} isSelected={selectedId===id} onCellClicked={handleCellClicked}></ColorCell>
        })
    }).flat();

    return cells;
}

