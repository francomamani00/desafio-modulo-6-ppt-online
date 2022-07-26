import "./router";
import "./pages/welcome-page";
import "./pages/set-name";
import "./pages/connect-room";
import "./pages/instructions-page";
import "./pages/share-id";
import { initButton } from "./components/button";
import { initCustomText } from "./components/text";
import { initPiedra } from "./components/piedra";
import { initPapel } from "./components/papel";
import { initTijera } from "./components/tijera";
import { initContadorComp } from "./components/count-down";
import { initScore } from "./components/score";
import "./state";
import { Router } from "@vaadin/router";

(function () {
  initButton();
  initCustomText();
  initPiedra();
  initPapel();
  initTijera();
  initContadorComp();
  initScore();
  const root = document.querySelector(".root");
  Router.go("/");
  console.log("acaestoy");
})();