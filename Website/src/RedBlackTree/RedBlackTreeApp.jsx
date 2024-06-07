

import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";
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
                    <div className="w-[54rem] h-[40rem] bg-gray-300 rounded-3xl border-8 border-gray-700 relative">
                        <div className="absolute top-[80px] left-[60px] h-1 w-20  bg-black z-0"></div>
                        <div className="absolute top-[100px] left-[80px] h-1 w-20 rotate-[315deg] bg-black"></div>
                        <RedBlackNode x="120" y="20" value="1234567"/>
                        <RedBlackNode x="40" y="100" value="2345678"/>
                    </div>
                </div>
            </div>
        </div>
      </>
    )
  }
  
  export default RedBlackTreeApp