import { useState } from "react";
import ColorCell from "./ColorCell";
import { paletteSelectors } from "../store/palette";
import { useSelector } from "react-redux";

export default function ColorCellGrid(){

    let [selectedId, setSelected] = useState(null);

    let colors = useSelector(paletteSelectors.selectStuff);

    let handleCellClicked = (cellId) => {
        setSelected(cellId);
    }

    return <div className="m-4 w-[50rem] h-[50rem] relative">
        {colorsToCells(colors, selectedId, handleCellClicked)}
    </div>
}

let colorsToCells = (colors, selectedId, handleCellClicked) => {
    if(colors.length === 0 || colors[0].length === 0) return [];
    let width = 50 / colors[0].length;
    let height = 50 / colors.length;
    
    let cells = colors.map((row, j) => {
        return row.map((color, i) => {
            let id = `${i}:${j}`;
            return <ColorCell key={id} id={id} position={{X:i*width, Y:j*height}} size={{X:width, Y:height}} color={color} isSelected={selectedId===id} onCellClicked={handleCellClicked}></ColorCell>
        })
    }).flat();

    return cells;
}

