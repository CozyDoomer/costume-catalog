import React from "react";
import {Tags} from "../tags/Tags";

export function Costume(props) {
    const pr = props.costume;
    return <div className="collection-item col s12 m8 offset-m2 l6 offset-l3">
        <div className="row valign-wrapper">
            <div className="col s2">
                <img src={pr.picture} alt="" className="responsive-img"/>
            </div>
            <div className="col s10">
                <span className="name">{pr.name}</span>
                <br/><span className="location">{pr.description} @ {pr.location}</span>
                <br/><Tags tags={pr.tags} search={props.search} updateSearch={props.updateSearch}/>
            </div>
        </div>
    </div>;
}