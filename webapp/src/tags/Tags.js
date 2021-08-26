import React from "react";
import Tag from "./Tag";
import "./Tag.css";

const Tags = (props) => {
  const tags = props.tags
    .slice()
    .sort((a, b) => b.importance - a.importance)
    .map((sk, i) => (
      <Tag
        tag={sk}
        highlighted={highlighted(sk, props.search)}
        key={i}
        updateSearch={props.updateSearch}
        currentSearch={props.search}
      />
    ));
  return <div className="tags col row valign-wrapper">{tags}</div>;
};

function highlighted(tag, search) {
  const searchWords = search.split(" ").filter((e) => e);

  let hit = false;
  searchWords.forEach((searchWord) => {
    if (tag.name.toLowerCase().startsWith(searchWord.toLowerCase())) {
      hit = true;
    }
  });
  return search && hit;
}

export default Tags;
