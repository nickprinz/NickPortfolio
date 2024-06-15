import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, children, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    // Using useEffect to sync the Modal component with the DOM Dialog API
    // This code will open the native <dialog> via it's built-in API whenever the <Modal> component is rendered
    const modal = dialog.current;
    if(modal){
        if (open) {
            modal.showModal();
        }

    }
  }, [open]);

  return createPortal(
    <AnimatePresence>
        {open && <motion.dialog ref={dialog} onClose={onClose} onCancel={event => event.preventDefault()} transition={{ duration:.3, }} exit={{opacity:0, y:20}}  initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} >
            {children}
        </motion.dialog>}
    </AnimatePresence>
,
    document.getElementById("modal")
  );
}