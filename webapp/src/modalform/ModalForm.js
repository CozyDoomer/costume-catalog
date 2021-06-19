import React, { forwardRef, useState, useRef } from "react";
import { Modal } from "./Modal";
import AddButton from "./AddButton";

const ModalForm = forwardRef(({ addButtonText }, ref) => {
  const [shown, setShown] = useState({ isShown: false });
  const addButton = useRef(null);
  const closeButton = useRef(null);
  const modalRef = useRef(null);

  const showModal = () => {
    setShown({ isShown: true });
    toggleScrollLock();
  };

  const closeModal = () => {
    setShown({ isShown: false });
    addButton.current.focus();
    toggleScrollLock();
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 27) {
      closeModal();
    }
  };

  const onClickOutside = (event) => {
    if (modalRef && modalRef.current.contains(event.target)) return;
    closeModal();
  };

  const toggleScrollLock = () => {
    document.querySelector("html").classList.toggle("scroll-lock");
  };

  return (
    <React.Fragment>
      <AddButton
        showModal={showModal}
        buttonRef={addButton}
        addButtonText={addButtonText}
      />
      {shown.isShown ? (
        <Modal
          modalRef={modalRef}
          buttonRef={closeButton}
          closeModal={closeModal}
          onKeyDown={onKeyDown}
          onClickOutside={onClickOutside}
        />
      ) : null}
    </React.Fragment>
  );
});

export default ModalForm;
