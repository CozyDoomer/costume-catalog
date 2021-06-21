import React from "react";
import { Costume } from "./Costume";
import "./Costume.css";

const Costumes = (props) => {
  if (props.costumes === undefined) {
    return <div></div>;
  }
  const costumes = props.costumes.costumes.map((pr, i) => (
    <Costume
      costume={pr}
      id={pr.id}
      key={i}
      search={props.search}
      setInitialForm={props.setInitialForm}
      setFormType={props.setFormType}
      setModalShown={props.setModalShown}
      updateSearch={props.updateSearch}
      deleteCostume={props.deleteCostume}
      updateCostume={props.updateCostume}
    />
  ));
  return <div>{costumes}</div>;
};

export default Costumes;
