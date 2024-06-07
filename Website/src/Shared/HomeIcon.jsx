import { Link } from "react-router-dom";
import npIcon from "../assets/np.png"

export default function HomeIcon(){
    return <Link to="/"><img className="absolute right-20 top-0" src={npIcon}></img></Link>
}