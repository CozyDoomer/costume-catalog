import React, { useRef, useEffect } from "react";
import { Modal } from "./Modal";

const ModalForm = ({ initialForm, formType, setModalShown }) => {
  const closeButton = useRef(null);
  const modalRef = useRef(null);

  const closeModal = () => {
    setModalShown({ isShown: false });
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

  useEffect(() => {
    // toggle scroll lock on when component is built - toggle off on cleanup
    toggleScrollLock();
    return function cleanup() {
      toggleScrollLock();
    };
  });

  return (
    <Modal
      initialForm={initialForm}
      formType={formType}
      modalRef={modalRef}
      buttonRef={closeButton}
      closeModal={closeModal}
      onKeyDown={onKeyDown}
      onClickOutside={onClickOutside}
    />
  );
};

export default ModalForm;
