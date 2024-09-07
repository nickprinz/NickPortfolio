
import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";
import ColorCellGrid from "./components/ColorCellGrid";
import ColorGridContainer from "./components/ColorGridContainer";
import PaletteProvider from "./PaletteProvider";

function PaletteMakerApp() {
    setBodyColor("bg-neutral-800");
    setPageTitle("An easy palette generator");
    
    return (
      <>
        <HomeIcon/>
        <h1 className=" pt-6 pb-6 p-4 text-center text-6xl font-extrabold tracking-widest font-mono bg-black text-white ">Palette Maker</h1>
        <PaletteProvider>
          <ColorGridContainer>
            <ColorCellGrid/>
          </ColorGridContainer>
        </PaletteProvider>

      </>
    )
  }
  
  export default PaletteMakerApp