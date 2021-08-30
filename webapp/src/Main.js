import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COSTUMES, DELETE_COSTUME, UPDATE_COSTUME } from "./gql/queries";
import Costumes from "./costumes/Costumes";
import AddButton from "./modalform/AddButton";
import ModalForm from "./modalform/ModalForm";
import "./search/SearchBox.css";
import "./Main.css";

const Main = () => {
  const addButtonText = "ADD";
  const clearButtonText = "CLEAR";

  const addButton = useRef(null);
  const [modalShown, setModalShown] = useState({ isShown: false });
  const [formType, setFormType] = useState({ isEdit: false });

  const [search, setSearch] = useState("");

  const { data } = useQuery(GET_COSTUMES, {
    variables: { search },
    pollInterval: 500,
  });

  const [deleteCostume] = useMutation(DELETE_COSTUME);
  const [updateCostume] = useMutation(UPDATE_COSTUME);

  const showModal = () => {
    setFormType({ isEdit: false });
    setModalShown({ isShown: true });
  };

  const updateSearch = (search) => {
    let safeSearch = search.replace(/[^\w\s]/gi, "");
    setSearch(safeSearch);
  };

  const [initialForm, setInitialForm] = useState({
    id: "",
    name: "",
    location: "",
    description: "",
    picture: "",
    tags: { "input-0": "" },
  });

  return (
    <div className="container collection" style={{ marginTop: "20px" }}>
      <div className="row" style={{ marginTop: "20px" }}>
        <div className="col s6 m8 l10">
          <input
            className="form-control"
            placeholder="Search costumes"
            type="search"
            onChange={(e) => updateSearch(e.target.value)}
            value={search}
          />
        </div>

        <div className="col s3 m2 l1">
          <button
            className="waves-effect waves-light btn-small"
            type="reset"
            onClick={() => updateSearch("")}
          >
            {clearButtonText}
          </button>
        </div>
        <div className="col s3 m2 l1">
          <AddButton
            setInitialForm={setInitialForm}
            showModal={showModal}
            buttonRef={addButton}
            addButtonText={addButtonText}
          />
        </div>
      </div>
      {modalShown.isShown ? (
        <ModalForm
          initialForm={initialForm}
          formType={formType}
          setModalShown={setModalShown}
        />
      ) : null}
      <Costumes
        costumes={data}
        search={search}
        updateSearch={updateSearch}
        setInitialForm={setInitialForm}
        setFormType={setFormType}
        setModalShown={setModalShown}
        deleteCostume={deleteCostume}
        updateCostume={updateCostume}
      />
    </div>
  );
};

export default Main;
