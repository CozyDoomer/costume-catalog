import React from "react";
import ReactDOM from "react-dom";
import FocusTrap from "focus-trap-react";
import { Form } from "./Form";
import { useEffect } from "react";

export const Modal = ({
  initialForm,
  formType,
  modalRef,
  buttonRef,
  closeModal,
  onKeyDown,
  onClickOutside,
}) => {
  useEffect(() => {
    buttonRef.current.focus();
  });

  return ReactDOM.createPortal(
    <FocusTrap>
      <aside
        tag="aside"
        role="dialog"
        tabIndex="-1"
        aria-modal="true"
        className="modal-cover"
        onClick={onClickOutside}
        onKeyDown={onKeyDown}
      >
        <div className="modal-area" ref={modalRef}>
          <button
            ref={buttonRef}
            className="_modal-close waves-effect waves-teal btn-flat"
            onClick={closeModal}
          >
            <span id="close-modal" className="_hide-visual">
              Close
            </span>
            <svg className="_modal-close-icon" viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <div className="modal-body">
            <Form
              initialForm={initialForm}
              formType={formType}
              closeModal={closeModal}
            />
          </div>
        </div>
      </aside>
    </FocusTrap>,
    document.body
  );
};

export default Modal;
