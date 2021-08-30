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
      className="waves-effect waves-light btn-small"
      ref={buttonRef}
      onClick={showAddModal}
    >
      {addButtonText}
    </button>
  );
};
export default AddButton;
