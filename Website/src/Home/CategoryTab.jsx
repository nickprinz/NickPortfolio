import { NavLink } from "react-router-dom";

export default function CategoryTab({url, children, props}){
    const positioningClasses = "py-1 px-4 rounded-t-md block text-center";

    return <li className="w-full">
        <NavLink
            to={url}
            className={({ isActive }) =>
                isActive ? `bg-emerald-400 ${positioningClasses}` : `bg-emerald-600 ${positioningClasses}`
            }
            {...props}>
        {children}
        </NavLink>
    </li>
}