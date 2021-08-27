import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { AUTHENTICATE } from "./gql/queries";

import Main from "./Main";

const App = () => {
  const bcrypt = require("bcryptjs");

  function useStickyState(defaultValue, key) {
    const [value, setValue] = useState(() => {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    });
    React.useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
  }

  const useFormInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
      setValue(e.target.value);
    };
    return {
      value,
      onChange: handleChange,
    };
  };

  const passwordInput = useFormInput("");

  const [render, setRender] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [authHash, setAuthHash] = useStickyState("", "authHash");

  const [authenticate] = useMutation(AUTHENTICATE);
  const authenticateRequest = {
    variables: {
      password: "",
    },
  };

  async function hashPW(password) {
    const salt = await bcrypt.genSalt(6);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }

  async function handleLogin() {
    let pw = "";
    if (authHash !== "" && passwordInput.value === "") {
      pw = authHash;
    } else if (authHash === "" && passwordInput.value === "") {
      setRender(true);
      return;
    } else {
      pw = await hashPW(passwordInput.value);
    }
    authenticateRequest.variables.password = pw;
    let loginResult = await authenticate(authenticateRequest);
    if (loginResult.data.Authenticate) {
      setRender(true);
      setLoggedIn(true);
      setError(false);
      setAuthHash(pw);
    } else {
      setRender(true);
      setError(true);
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    handleLogin();
  }, []);

  const loginInputKeyPress = (e) => {
    if (e.which === 13) {
      handleLogin(e);
    }
  };

  return (
    <Route exact path="/">
      {render && (
        <div>
          {loggedIn ? (
            <Route exact path="/" component={Main} />
          ) : (
            <div className="container">
              <h4>Login</h4>
              <div className="row" />
              <div className="row">
                <div className="form-group input-field">
                  <input
                    id="password"
                    type="password"
                    {...passwordInput}
                    onKeyPress={loginInputKeyPress}
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </div>
              <div className="row">
                <button
                  className="waves-effect waves-light btn"
                  type="submit"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
              <div className="row">
                {error && (
                  <small style={{ color: "red" }}>Wrong Password</small>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Route>
  );
};

export default App;
