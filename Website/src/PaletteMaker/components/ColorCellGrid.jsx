import { useState } from "react";
import ColorCell from "./ColorCell";

export default function ColorCellGrid(){

    let [selectedId, setSelected] = useState(null);

    let colors = getColorArrays(4,10);//will eventually be a selector

    let handleCellClicked = (cellId) => {
        setSelected(cellId);
    }

    return <div className="m-4 w-[50rem] h-[50rem] relative">
        {colorsToCells(colors, selectedId, handleCellClicked)}
    </div>
}

let getColorArrays = (width, height) => {
    let grid = [];
    for (let j = 0; j < height; j++) {
        let row = [];
        for (let i = 0; i < width; i++) {
            row.push(randomColor());
        }
        grid.push(row);
    }
    return grid;
}

let randomColor = () => {
    return "#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6,"0");
}

let colorsToCells = (colors, selectedId, handleCellClicked) => {
    if(colors.length === 0 || colors[0].length === 0) return [];
    let width = 50 / colors[0].length;
    let height = 50 / colors.length;
    let key = 0;
    let cells = colors.map((row, j) => {
        return row.map((color, i) => {
            let id = `${i}:${j}`;
            return <ColorCell key={id} id={id} position={{X:i*width, Y:j*height}} size={{X:width, Y:height}} color={color} isSelected={selectedId===id} onCellClicked={handleCellClicked}></ColorCell>
        })
    }).flat();

    return cells;
}

