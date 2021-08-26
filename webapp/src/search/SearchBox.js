import React from "react";
import "./SearchBox.css";

const SearchBox = (props) => {
  return (
    <div>
      <input
        className="form-control"
        placeholder="Search costumes"
        style={{ marginLeft: "10px", width: "76%" }}
        type="search"
        onChange={(e) => props.updateSearch(e.target.value)}
        value={props.search}
      />

      <button
        className="waves-effect waves-light btn"
        type="reset"
        onClick={() => props.updateSearch("")}
      >
        Clear
      </button>
    </div>
  );
};

export default SearchBox;
