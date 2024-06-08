

import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";
import LineBetween from "./LineBetween";
import RedBlackContainer from "./RedBlackContainer";
import RedBlackNodeElement from "./RedBlackNodeElement";

function RedBlackTreeApp() {
    setBodyColor("bg-rose-950");
    setPageTitle("Red Black Tree Simulator");
    
    return (
      <>
        <HomeIcon/>
        <div className="p-4 pt-10 ">
            <h1 className="text-center text-5xl font-extrabold font-mono text-rose-300">Red Black Tree Simulator</h1>
            <RedBlackContainer>
                <RedBlackNodeElement x={120} y={40} value="1234567"/>
                <RedBlackNodeElement x={40} y={100} value="2345678"/>
                <LineBetween toPoint={{x:40, y:100}} fromPoint={{x:120, y:40}}/>
                
                <RedBlackNodeElement x={220} y={200} value="1234567"/>
                <RedBlackNodeElement x={40} y={200} value="2345678"/>
                <LineBetween toPoint={{x:220, y:200}} fromPoint={{x:40, y:200}}/>
                
                <RedBlackNodeElement x={500} y={100} value="1234567"/>
                <RedBlackNodeElement x={500} y={200} value="2345678"/>
                <LineBetween toPoint={{x:500, y:100}} fromPoint={{x:500, y:200}}/>
            </RedBlackContainer>
        </div>
      </>
    )
  }
  
  export default RedBlackTreeApp