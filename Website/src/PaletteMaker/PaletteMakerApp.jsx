
import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor } from "../Shared/utility";

function PaletteMakerApp() {
    setBodyColor("bg-gray-800");
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