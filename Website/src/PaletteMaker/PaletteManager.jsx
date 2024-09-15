import ColorCellGrid from "./components/ColorCellGrid";
import ColorGridContainer from "./components/ColorGridContainer";
import OptionsManager from "./components/Options/OptionsManager";
import PaletteInputHolder from "./components/PaletteInputHolder";


export default function PaletteManager(){

    return <>
        <ColorGridContainer>
        <OptionsManager/>
            <PaletteInputHolder/>
            <ColorCellGrid/>
        </ColorGridContainer>
    </>
}