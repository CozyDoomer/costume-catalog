import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import App from "./App";

import "./index.css";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_URL}/v1/graphql`,
  cache: new InMemoryCache().restore({}),
  link: createUploadLink({
    uri: `${process.env.REACT_APP_API_URL}/v1/graphql`,
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
