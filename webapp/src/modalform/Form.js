import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COSTUME } from "../gql/queries";

export const Form = ({ closeModal }) => {
  const [addCostume] = useMutation(CREATE_COSTUME);
  // TODO: allow edit e.g.
  // const [editCostume] = useMutation(UPDATE_COSTUME);

  const onSubmit = (event) => {
    event.preventDefault(event);

    const tagNames = Object.values(formInput.tags);
    let tags = [];

    // only add tag if input is not empty
    tagNames.forEach((tagName) => {
      if (tagName !== "") {
        tags.push({
          name: tagName,
          icon: "", // TODO: allow picking icons or search for them in name / desc
          importance: 10, // TODO: allow choosing importance to sort tags by it
        });
      }
    });

    let request = {
      variables: {
        name: formInput.name,
        description: formInput.description,
        picture: formInput.picture,
        location: formInput.location,
        tags: tags,
      },
    };

    console.log(request);
    addCostume(request);
    closeModal();
  };

  const [formInput, setFormInput] = useState({
    name: "",
    location: "",
    description: "",
    picture: "",
    tags: { "input-0": "" },
  });

  const handleTagChange = (event) => {
    formInput.tags[event.target.name] = event.target.value;
    setFormInput(formInput);
  };

  const handleChange = (event) => {
    setFormInput({ ...formInput, [event.target.name]: event.target.value });
  };

  const appendInput = () => {
    var newFormInput = { ...formInput };
    const newKey = `input-${Object.keys(formInput.tags).length}`;
    newFormInput.tags[newKey] = "";
    setFormInput(newFormInput);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <input
          className="form-control"
          onChange={handleChange}
          name="name"
          required
        />
        <label htmlFor="name">Name</label>
      </div>
      <div className="form-group">
        <input
          className="form-control"
          onChange={handleChange}
          name="location"
          required
        />
        <label htmlFor="location">Location</label>
      </div>
      <div className="form-group">
        <input
          className="form-control"
          onChange={handleChange}
          name="description"
        />
        <label htmlFor="description">Description</label>
      </div>
      <div className="form-group">
        <input
          className="form-control"
          onChange={handleChange}
          name="picture"
        />
        <label htmlFor="picture">Picture</label>
      </div>
      {/*  
    <div class="input-group mb-3">
      <div class="custom-file">
        <input type="file" class="custom-file-input" name="inputGroupFile02">
        <label class="custom-file-label" for="inputGroupFile02">Choose file</label>
      </div>
      <div class="input-group-append">
        <span class="input-group-text" name="">Upload</span>
      </div>
    </div>      */}
      <div className="container">
        <div className="form-group">
          <div className="row" />
          <label htmlFor="tags">Tags</label>
          <div name="dynamicInput">
            {Object.keys(formInput.tags).map((tagKey) => (
              <input
                key={tagKey}
                className="form-control"
                onChange={handleTagChange}
                name={tagKey}
              />
            ))}
          </div>
        </div>
        <button
          className="form-control btn"
          type="button"
          onClick={() => appendInput()}
        >
          +
        </button>
      </div>
      <div className="row" />
      <div className="form-group">
        <input
          className="form-control btn btn-primary"
          type="submit"
          value="Submit"
        />
      </div>
    </form>
  );
};
export default Form;
