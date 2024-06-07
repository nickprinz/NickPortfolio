import { Outlet } from "react-router-dom";

export default function HomeLayout(){
    document.body.setAttribute("class", "bg-gray-900");
    return <>
        <main>
            <Outlet></Outlet>
        </main>
    </> ;
}
