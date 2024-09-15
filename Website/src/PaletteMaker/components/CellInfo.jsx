import { motion } from "framer-motion";
import { ShowText } from "../store/palette";

export default function CellInfo({children}){

    return <div className="text-center flex flex-col items-center select-none m-auto" >
            <div className="bg-white rounded-md px-2 py-1 select-none">
                {children}
            </div>
        </div>
}