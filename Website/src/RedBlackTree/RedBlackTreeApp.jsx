
import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";
import RedBlackManager from "./RedBlackManager";
import RedBlackProvider from "./RedBlackProvider";

function RedBlackTreeApp() {
    setBodyColor("bg-gradient-to-r from-red-900 via-rose-950 to-red-900");
    setPageTitle("Red Black Tree Simulator");
    //creating the store here has an issue: any code change will clear the store because files are reloaded
    //to fix that, move the provider out of the RedBlackTree folder or give this app its own index.html to give a full separation between projects
    return (
      <RedBlackProvider>
        <HomeIcon/>
        <h1 className=" pt-6 pb-6 p-4 text-center text-6xl font-extrabold tracking-widest font-mono bg-zinc-950 text-rose-300">Red <span className="text-zinc-500 pl-6 pr-4">Black</span> Tree</h1>
        <RedBlackManager/>
      </RedBlackProvider>
    )
  }
  
  export default RedBlackTreeApp