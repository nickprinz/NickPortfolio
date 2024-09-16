import { useState } from "react";
import ColorCell from "./ColorCell";
import { useSelector } from "react-redux";
import { paletteSelectors } from "../store/palette";

export default function ColorCellGrid(){
    let gridWidth = 50;
    let gridHeight = 30;

    let colors = useSelector(paletteSelectors.getColorGrid);

    return <div className="m-4 relative" style={{width:(gridWidth+"rem"), height:(gridHeight+"rem")}}>
        {colorsToCells(colors, gridWidth, gridHeight,)}
    </div>
}

let colorsToCells = (colors, gridWidth, gridHeight,) => {
    if(colors.length === 0 || colors[0].length === 0) return [];
    let width = gridWidth / colors[0].length;
    let height = gridHeight / colors.length;
    let cells = colors.map((row, j) => {
        return row.map((color, i) => {
            const xPos = (i*width)-.1;
            return <ColorCell key={color.id} id={color.id} position={{X:xPos, Y:j*height}} size={{X:(width+.1), Y:height}} color={color} ></ColorCell>
        })
    }).flat();

    return cells;
}