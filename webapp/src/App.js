import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COSTUMES, DELETE_COSTUME, UPDATE_COSTUME } from "./gql/queries";
import Costumes from "./costumes/Costumes";
import SearchBox from "./search/SearchBox";
import ModalForm from "./modalform/ModalForm";

const App = () => {
  const addButtonText = "Add Costume";

  const [search, setSearch] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_COSTUMES, {
    variables: { search },
    pollInterval: 2000,
  });

  const [deleteCostume] = useMutation(DELETE_COSTUME);
  const [updateCostume] = useMutation(UPDATE_COSTUME);

  const updateSearch = (search) => {
    let safeSearch = search.replace(/[^\w\s]/gi, "");
    setSearch(safeSearch);
  };

  return (
    <div className="container collection">
      <ModalForm addButtonText={addButtonText} />
      <SearchBox search={search} updateSearch={updateSearch} />
      <Costumes
        costumes={data}
        search={search}
        updateSearch={updateSearch}
        deleteCostume={deleteCostume}
        updateCostume={updateCostume}
      />
    </div>
  );
};

export default App;
