

import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";
import LineBetween from "./LineBetween";
import RedBlackNode from "./RedBlackNode";

function RedBlackTreeApp() {
    setBodyColor("bg-rose-950");
    setPageTitle("Red Black Tree Simulator");
    const nodeClasses = "absolute left-[40px] top-[20px] size-20 rounded-full bg-red-500 border-2 border-black items-centerflex place-content-center z-20";
    return (
      <>
        <HomeIcon/>
        <div className="p-4 pt-10 ">
            <h1 className="text-center text-5xl font-extrabold font-mono text-rose-300">Red Black Tree Simulator</h1>
            <div className="flex flex-col items-center py-6">
                <div className="rounded-3xl border-2 bg-gray-400 border-gray-400 shadow-xl shadow-slate-900">
                    <div className="w-[54rem] h-[40rem] bg-gray-300 rounded-3xl border-8 border-gray-700 relative overflow-hidden">
                        <RedBlackNode x={120} y={40} value="1234567"/>
                        <RedBlackNode x={40} y={100} value="2345678"/>
                        <LineBetween toPoint={{x:40, y:100}} fromPoint={{x:120, y:40}}/>
                        
                        <RedBlackNode x={220} y={200} value="1234567"/>
                        <RedBlackNode x={40} y={200} value="2345678"/>
                        <LineBetween toPoint={{x:220, y:200}} fromPoint={{x:40, y:200}}/>
                        
                        <RedBlackNode x={500} y={100} value="1234567"/>
                        <RedBlackNode x={500} y={200} value="2345678"/>
                        <LineBetween toPoint={{x:500, y:100}} fromPoint={{x:500, y:200}}/>
                    </div>
                </div>
            </div>
        </div>
      </>
    )
  }
  
  export default RedBlackTreeApp