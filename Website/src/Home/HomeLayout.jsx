import { NavLink, Outlet } from "react-router-dom";

export default function HomeLayout(){
    document.body.setAttribute("class", "bg-gray-900");
    return <>
        <main>
          <div className='p-4 pt-10 '>
            <h1 className='text-center text-slate-300 text-5xl font-extrabold font-mono'>Nick Prinz</h1>
          </div>
        <nav className="flex flex-col items-center">
            <ul className=" w-96 self-center flex flex-row justify-between border-b-2 pb-1 px-2">
            <li>
                <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "bg-emerald-500 py-1 px-4 rounded-t-md" : "bg-emerald-600 py-1 px-4 rounded-t-md"
                }
                end
                >
                Experience
                </NavLink>
            </li>
            <li>
                <NavLink
                to="/projects"
                className={({ isActive }) =>
                    isActive ? "bg-emerald-500 py-1 px-4 rounded-t-md" : "bg-emerald-600 py-1 px-4 rounded-t-md"
                }
                >
                Projects
                </NavLink>
            </li>
            </ul>
        </nav>
        <div className="">
          <Outlet></Outlet>
        </div>
        </main>
    </> ;
}
