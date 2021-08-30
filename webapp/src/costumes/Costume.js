import React from "react";
import Tags from "../tags/Tags";
import "./Costume.css";

const Costume = (props) => {
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

    // TODO: simplify tags! better datasetructure that works for form and graphql
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

  return (
    <div className="collection-item col s12 m8 offset-m2 l6 offset-l3">
      <button
        className="waves-effect waves-teal btn-flat"
        onClick={(_) => props.deleteCostume(deleteRequest)}
        style={{ float: "right" }}
      >
        <i className="fas fa-trash"></i>
      </button>
      <button
        className="waves-effect waves-teal btn-flat"
        onClick={(_) => editForm()}
        style={{ float: "right" }}
      >
        <i className="fas fa-edit"></i>
      </button>
      <div className="row valign-wrapper">
        <div className="col s5 m4 l3">
          <img src={pr.picture} alt="" className="responsive-img" />
        </div>
        <div className="col s7 m8 l9">
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
};

export default Costume;
