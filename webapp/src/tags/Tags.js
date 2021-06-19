import React from "react";
import { Tag } from "./Tag";
import "./Tag.css";

export function Tags(props) {
    const tags = props.tags.slice()
        .sort((a, b) => b.importance - a.importance)
        .map((sk, i) => <Tag
            tag={sk} highlighted={highlighted(sk, props.search)}
            key={i} updateSearch={props.updateSearch} />);
    return <div className="tags col row valign-wrapper">{tags}</div>
}

function highlighted(tag, search) {
    return search && tag.name.toLowerCase().startsWith(search.toLowerCase())
}