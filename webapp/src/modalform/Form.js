import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COSTUME, UPDATE_COSTUME } from "../gql/queries";

export const Form = ({ initialForm, formType, closeModal }) => {
  const [addCostume] = useMutation(CREATE_COSTUME);
  const [editCostume] = useMutation(UPDATE_COSTUME);

  const [formInput, setFormInput] = useState(initialForm);

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

    if (formType.isEdit) {
      const data = {
        variables: {
          id: formInput.id,
          name: formInput.name,
          description: formInput.description,
          picture: formInput.picture,
          location: formInput.location,
          tags: tags,
        },
      };
      editCostume(data);
    } else {
      const data = {
        variables: {
          name: formInput.name,
          description: formInput.description,
          picture: formInput.picture,
          location: formInput.location,
          tags: tags,
        },
      };
      addCostume(data);
    }
    closeModal();
  };

  const handleTagChange = (event) => {
    formInput.tags[event.target.name] = event.target.value;
    setFormInput(formInput);
  };

  const resizeLargeImage = (base64Str) => {
    return new Promise((resolve) => {
      let byteCount = base64Str.length;

      // if > 14 mb resize the image
      if (byteCount > 14000000) {
        let img = new Image();
        img.src = base64Str;
        img.onload = () => {
          let canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_SIDE = 1000;

          if (width >= height) {
            if (width > MAX_SIDE) {
              height *= MAX_SIDE / width;
              width = MAX_SIDE;
            }
          } else {
            if (height > MAX_SIDE) {
              width *= MAX_SIDE / height;
              height = MAX_SIDE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL());
        };
      } else {
        // if <= 14 mb return the input unchanged
        resolve(base64Str);
      }
    });
  };

  const handleImageChange = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    if (validity.valid) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let imageBase64 = reader.result;
        resizeLargeImage(imageBase64).then((result) => {
          formInput.picture = result;
          setFormInput(formInput);
        });
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
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
          defaultValue={formInput.name}
          onChange={handleChange}
          name="name"
          required
        />
        <label htmlFor="name">Name</label>
      </div>
      <div className="form-group">
        <input
          className="form-control"
          defaultValue={formInput.location}
          onChange={handleChange}
          name="location"
          required
        />
        <label htmlFor="location">Location</label>
      </div>
      <div className="form-group">
        <input
          className="form-control"
          defaultValue={formInput.description}
          onChange={handleChange}
          name="description"
        />
        <label htmlFor="description">Description</label>
      </div>
      <div className="form-group">
        <div
          className="form-group file-field input-field"
          style={{ marginTop: "40px" }}
        >
          <div className="btn">
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="form-group">
          <div className="row" />
          <div name="dynamicInput">
            {Object.entries(formInput.tags).map(([tagKey, tagValue]) => (
              <input
                key={tagKey}
                className="form-control"
                defaultValue={tagValue}
                name={tagKey}
                onChange={handleTagChange}
              />
            ))}
          </div>
          <label htmlFor="tags">Tags</label>
          <button
            className="btn-floating btn-small waves-effect waves-light"
            style={{ marginLeft: 10 }}
            onClick={() => appendInput()}
            type="button"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div className="row" />
      <div className="form-group">
        <button className="btn waves-effect waves-light" type="submit">
          Submit <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};
export default Form;
