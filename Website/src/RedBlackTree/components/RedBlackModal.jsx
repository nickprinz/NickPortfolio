import Modal from "../../Shared/Modal";

export default function RedBlackModal({open, children, onClose }) {
  
    return <Modal onClose={onClose} open={open}>
        <div className="px-6 py-4 bg-red-900 text-zinc-400 border-2 border-zinc-950">
            {children}
        </div>
        </Modal>;
  }