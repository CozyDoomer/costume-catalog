import React from "react";
import Button from "react-bootstrap/Button";
import { Tags } from "../tags/Tags";
import "./Costume.css";

export function Costume(props) {
  const pr = props.costume;

  let deleteRequest = {
    variables: {
      id: props.id,
    },
  };

  // only show @ before location if it's actually set
  const location = pr.location !== "" ? " @ " + pr.location : "";

  const editForm = () => {
    let tags = {};

    // TODO: simplify tags? better datasetructure that works for form and graphql
    if (pr.tags.length === 0) {
      tags["input-0"] = "";
    } else {
      pr.tags.forEach((tag, i) => {
        tags["input-" + i] = tag.name;
      });
    }

    props.setInitialForm({
      id: pr.id,
      name: pr.name,
      location: pr.location,
      description: pr.description,
      picture: pr.picture,
      tags: tags,
    });

    props.setFormType({ isEdit: true });
    props.setModalShown({ isShown: true });
  };

  // TODO: allow toggling of tags to add multiple to search
  return (
    <div className="collection-item col s12 m8 offset-m2 l6 offset-l3">
      <Button
        variant="flat"
        onClick={(_) => props.deleteCostume(deleteRequest)}
        style={{ float: "right", marginLeft: 20 }}
      >
        <i className="fas fa-trash"></i>
      </Button>
      <Button
        variant="flat"
        // onClick={(e) => props.updateCostume(props.id)}
        onClick={(_) => editForm()}
        style={{ float: "right", marginLeft: 20 }}
      >
        <i className="fas fa-edit"></i>
      </Button>
      <div className="row valign-wrapper">
        <div className="col s2">
          <img src={pr.picture} alt="" className="responsive-img" />
        </div>
        <div className="col s10">
          <span className="name">{pr.name}</span>
          <br />
          <span className="location">
            {pr.description}
            {location}
          </span>
          <br />
          <Tags
            tags={pr.tags}
            search={props.search}
            updateSearch={props.updateSearch}
          />
        </div>
      </div>
    </div>
  );
}
