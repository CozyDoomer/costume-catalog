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
      className="waves-effect waves-light btn"
      ref={buttonRef}
      onClick={showAddModal}
      style={{ float: "right", marginTop: "7px", marginRight: "40px" }}
    >
      {addButtonText}
    </button>
  );
};
export default AddButton;
