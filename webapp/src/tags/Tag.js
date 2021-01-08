import React from "react";
import "./Tag.css"

export function Tag(props) {
    const tag = props.tag;
    const tagClass = props.highlighted ? "greenTag" : "greyTag";
    const cl = `tag ${tagClass} card-panel lighten-5`;
    const textStyle = tag.importance > 1 ? "boldText" : "";
    return <div className={cl} onClick={() => props.updateSearch(tag.name)}>
        {
            tag.icon ? <i className={`fas fa-${tag.icon}`}/> : ""
        } <span className={textStyle}>{tag.name}</span>
    </div>
}