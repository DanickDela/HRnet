/**
 * Point d’entrée principal de l’application.
 *
 * Ce fichier initialise l’application React et la monte dans le DOM.
 *
 * Il configure les providers globaux de l’application :
 * - `React.StrictMode` pour détecter certains problèmes potentiels en développement
 * - `StyleSheetManager` pour éviter que des props non valides de styled-components
 *   soient transmises au DOM
 * - `Provider` pour rendre le store Redux accessible à toute l’application
 * - `BrowserRouter` pour activer la navigation côté client avec React Router
 *
 * Il importe également la feuille de styles SCSS globale utilisée dans l’application.
 *
 * @module main
 */
import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import "./styles/main.scss";

import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StyleSheetManager>
  </React.StrictMode>,
);
