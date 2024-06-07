import { Outlet } from "react-router-dom";
import CategoryTab from "./CategoryTab";
import HomeIcon from "../Shared/HomeIcon";
import { setBodyColor, setPageTitle } from "../Shared/utility";

export default function HomeLayout(){
    setBodyColor("bg-gray-900");
    setPageTitle("Nick Prinz Developer Portfolio");
    return <>
        <main className="w-full h-full">
          <div className='p-4 pt-10 '>
            <h1 className='text-center text-slate-300 text-5xl font-extrabold font-mono over'>Nick Prinz</h1>
            <HomeIcon/>
          </div>
        <nav className="flex flex-col items-center">
            <ul className=" w-96 self-center flex flex-row justify-between border-b-2 pb-0 px-0.5 gap-x-1">
                <CategoryTab url="/" end>Experience</CategoryTab>
                <CategoryTab url="/projects" >Projects</CategoryTab>
            </ul>
        </nav>
        <div className="">
          <Outlet></Outlet>
        </div>
        </main>
    </> ;
}
