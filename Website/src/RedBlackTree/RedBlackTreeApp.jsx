

import {Provider, } from "react-redux";
import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";
import store from "./store/store";
import RedBlackManager from "./RedBlackManager";

function RedBlackTreeApp() {
    setBodyColor("bg-gradient-to-r from-red-900 via-rose-950 to-red-900");
    setPageTitle("Red Black Tree Simulator");
    
    return (
      <>
        <HomeIcon/>
        <Provider store={store}>
            <h1 className=" pt-6 pb-6 p-4 text-center text-6xl font-extrabold tracking-widest font-mono bg-zinc-950 text-rose-300">Red <span className="text-zinc-500">&nbsp;Black&nbsp;</span> Tree</h1>
            <RedBlackManager/>
        </Provider>
      </>
    )
  }
  
  export default RedBlackTreeApp