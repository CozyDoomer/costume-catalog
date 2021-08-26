import React from "react";
import "./Tag.css";

const Tag = (props) => {
  const tag = props.tag;
  const tagClass = props.highlighted ? "greenTag" : "greyTag";
  const cl = `tag ${tagClass} card-panel`;
  const textStyle = tag.importance > 1 ? "boldText" : "";

  const updateSearchField = (props) => {
    if (tagClass === "greenTag") {
      if (props.currentSearch.includes(" " + tag.name)) {
        props.updateSearch(props.currentSearch.replace(" " + tag.name, ""));
      } else if (props.currentSearch.includes(tag.name + " ")) {
        props.updateSearch(props.currentSearch.replace(tag.name + " ", ""));
      } else {
        props.updateSearch(props.currentSearch.replace(tag.name, ""));
      }
    } else {
      if (props.currentSearch === "") {
        props.updateSearch(tag.name);
      } else {
        props.updateSearch(props.currentSearch + " " + tag.name);
      }
    }
  };

  return (
    <div className={cl} onClick={() => updateSearchField(props)}>
      {tag.icon ? <i className={`fas fa-${tag.icon}`} /> : ""}{" "}
      <span className={textStyle}>{tag.name}</span>
    </div>
  );
};

export default Tag;
