
import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";

function PaletteMakerApp() {
    setBodyColor("bg-gray-800");
    setPageTitle("An easy palette generator");
    return (
      <>
        <HomeIcon/>
        <div>
            Make Palette
        </div>
      </>
    )
  }
  
  export default PaletteMakerApp