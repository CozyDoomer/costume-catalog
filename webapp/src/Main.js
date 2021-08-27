import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COSTUMES, DELETE_COSTUME, UPDATE_COSTUME } from "./gql/queries";
import Costumes from "./costumes/Costumes";
import SearchBox from "./search/SearchBox";
import AddButton from "./modalform/AddButton";
import ModalForm from "./modalform/ModalForm";

const Main = () => {
  const addButtonText = "Add Costume";
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
    <div className="container collection">
      <div className="row" />
      <div className="row">
        <AddButton
          setInitialForm={setInitialForm}
          showModal={showModal}
          buttonRef={addButton}
          addButtonText={addButtonText}
        />
        <SearchBox search={search} updateSearch={updateSearch} />
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
