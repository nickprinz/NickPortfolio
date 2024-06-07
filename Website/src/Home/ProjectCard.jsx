import { Link } from "react-router-dom";


export default function ProjectCard({url, children}){
    
    return <Link to={url}>
            <div className="w-48 h-48 bg-emerald-600 rounded-xl border-2 border-b-4 border-t-0 border-emerald-900">{children}</div>
        </Link> ;
}