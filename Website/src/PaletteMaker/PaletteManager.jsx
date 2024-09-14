import ColorCellGrid from "./components/ColorCellGrid";
import ColorGridContainer from "./components/ColorGridContainer";
import PaletteInputHolder from "./components/PaletteInputHolder";


export default function PaletteManager(){

    return <>
        <ColorGridContainer>
            <PaletteInputHolder/>
            <ColorCellGrid/>
        </ColorGridContainer>
    </>
}