import { useState } from "react";
import ColorCell from "./ColorCell";
import { useSelector } from "react-redux";
import { paletteSelectors } from "../store/palette";

export default function ColorCellGrid(){
    let gridWidth = 50;
    let gridHeight = 30;

    let rowCount = useSelector(paletteSelectors.getRowCount);
    let columnCount = useSelector(paletteSelectors.getColumnCount);

    return <div className="m-4 relative" style={{width:(gridWidth+"rem"), height:(gridHeight+"rem")}}>
        {colorsToCells(rowCount, columnCount, gridWidth, gridHeight,)}
    </div>
}

let colorsToCells = (rowCount, columnCount, gridWidth, gridHeight,) => {
    if(rowCount === 0 || columnCount === 0) return [];
    let width = gridWidth / columnCount;
    let height = gridHeight / rowCount;
    const cells = [];
    for (let i = 0; i < columnCount; i++) {
        for (let j = 0; j < rowCount; j++) {
            const xPos = (i*width)-.1;
            cells.push(<ColorCell key={`key${i}-${j}`} row={j} column={i} position={{X:xPos, Y:j*height}} size={{X:(width+.1), Y:height}} ></ColorCell>);
        }
    }

    return cells;
}