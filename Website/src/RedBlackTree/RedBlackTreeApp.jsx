

import {Provider, } from "react-redux";
import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";
import store from "./store/store";
import RedBlackManager from "./RedBlackManager";

function RedBlackTreeApp() {
    setBodyColor("bg-rose-950");
    setPageTitle("Red Black Tree Simulator");
    
    return (
      <>
        <HomeIcon/>
        <Provider store={store}>
            <div className="p-4 pt-10 ">
                <h1 className="text-center text-5xl font-extrabold font-mono text-rose-300">Red Black Tree Simulator</h1>
                <RedBlackManager/>
            </div>
        </Provider>
      </>
    )
  }
  
  export default RedBlackTreeApp