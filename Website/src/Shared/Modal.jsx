import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({className, open, children, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    // Using useEffect to sync the Modal component with the DOM Dialog API
    // This code will open the native <dialog> via it's built-in API whenever the <Modal> component is rendered
    const modal = dialog.current;
    
    if (open) {
        modal.showModal();
      } else {
        modal.close();
      }

    return () => {
      modal.close(); // needed to avoid error being thrown
    };
  }, [open]);

  return createPortal(
    <dialog ref={dialog} onClose={onClose} onCancel={event => event.preventDefault()}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}