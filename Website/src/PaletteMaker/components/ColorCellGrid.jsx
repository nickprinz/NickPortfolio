import { useState } from "react";
import ColorCell from "./ColorCell";
import { useSelector } from "react-redux";
import { paletteSelectors } from "../store/palette";

export default function ColorCellGrid(){

    let [selectedId, setSelected] = useState(null);

    let gridWidth = 50;
    let gridHeight = 30;

    let colors = useSelector(paletteSelectors.getColorGrid);
    let showText = useSelector(paletteSelectors.getShowText);

    let handleCellClicked = (cellId) => {
        if(selectedId === cellId){
            setSelected(-1);
            return;
        }
        setSelected(cellId);
    }

    return <div className="m-4 relative" style={{width:(gridWidth+"rem"), height:(gridHeight+"rem")}}>
        {colorsToCells(colors, selectedId, gridWidth, gridHeight, handleCellClicked, showText)}
    </div>
}

let colorsToCells = (colors, selectedId, gridWidth, gridHeight, handleCellClicked, showText) => {
    if(colors.length === 0 || colors[0].length === 0) return [];
    let width = gridWidth / colors[0].length;
    let height = gridHeight / colors.length;
    
    let cells = colors.map((row, j) => {
        return row.map((color, i) => {
            let id = `${i}:${j}`;
            const xPos = (i*width)-.1;
            return <ColorCell key={color.id} id={color.id} position={{X:xPos, Y:j*height}} size={{X:(width+.1), Y:height}} color={color} isSelected={selectedId===id} onCellClicked={handleCellClicked}
            infoType={showText}></ColorCell>
        })
    }).flat();

    return cells;
}


// hexColor: string,
// lum: number,
// id: string,
// rowNum: number,
// colNum: number,