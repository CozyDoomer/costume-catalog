import React from "react";
const AddButton = ({ addButtonText, buttonRef, showModal }) => {
  return (
    <button
      className="btn btn-lg btn-danger center modal-button"
      ref={buttonRef}
      onClick={showModal}
      style={{ float: 'right', marginRight: 20, marginTop: 20 }}
    >
      {addButtonText}
    </button>
  );
};
export default AddButton;
