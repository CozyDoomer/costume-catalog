import React from "react";
import "./SearchBox.css"

const SearchBox = (props) => {
    return <div className="row">
        <div className="input-field col s12">
            <input placeholder="Type name, description, location or tag to filter..."
                   id="search_string" type="text" className="Input"
                   onChange={(e) => props.updateSearch(e.target.value)}
                   value={props.search}
            />
        </div>
    </div>
}

export default SearchBox;