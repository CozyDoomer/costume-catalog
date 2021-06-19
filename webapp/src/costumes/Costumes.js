import React from "react";
import { Costume } from "./Costume";
import "./Costume.css";

const Costumes = (props) => {
  if (props.costumes === undefined) {
    return <div></div>;
  }
  console.log(props);
  const costumes = props.costumes.costumes.map((pr, i) => (
    <Costume
      costume={pr}
      id={pr.id}
      key={i}
      search={props.search}
      updateSearch={props.updateSearch}
      deleteCostume={props.deleteCostume}
      updateCostume={props.updateCostume}
    />
  ));
  return <div>{costumes}</div>;
};

export default Costumes;
