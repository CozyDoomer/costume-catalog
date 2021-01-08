import React from "react";
import {Costume} from "./Costume";
import "./Costume.css";

export function Costumes(props) {
    const costumes = props.costumes.map(
        (pr, i) => <Costume costume={pr} key={i}
                               search={props.search}
                               updateSearch={props.updateSearch}/>
    );
    return <div>{costumes}</div>
}