import "./init";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const domnode = document.getElementById("root");
if (!domnode) {
  throw new Error("element with id 'root' not found");
}

const client = new ApolloClient({
  uri: "https://api.monday.com/v2",
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${import.meta.env.VITE_MONDAY_API_KEY}`
  }
});

const root = createRoot(domnode);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
