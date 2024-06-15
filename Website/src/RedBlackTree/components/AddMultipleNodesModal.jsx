import RedBlackModal from "./RedBlackModal";


export default function AddMultipleNodesModal({open, value, max, children, onClose }) {
  
    return <RedBlackModal onClose={onClose} open={open}>
            <h1 className="text-xl text-zinc-200">Please wait while inserting these values...</h1>
            <progress className=" m-2 ml-0 mt-6 mb-0 w-full h-3 rounded-full border-2 border-zinc-950 [&::-webkit-progress-bar]:bg-zinc-800 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500" max={max} value={value}></progress>
        </RedBlackModal>;
  }