import React from "react";
const AddButton = ({ setInitialForm, addButtonText, buttonRef, showModal }) => {
  const showAddModal = () => {
    setInitialForm({
      id: "",
      name: "",
      location: "",
      description: "",
      picture: "",
      tags: { "input-0": "" },
    });
    showModal();
  };
  return (
    <button
      className="btn btn-lg btn-danger center modal-button"
      ref={buttonRef}
      onClick={showAddModal}
      style={{ float: "right", marginRight: 20, marginTop: 20 }}
    >
      {addButtonText}
    </button>
  );
};
export default AddButton;
