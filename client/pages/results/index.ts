import { Router } from "@vaadin/router";
import { state } from "../../state";
const imgWin = require("url:../../../client/images/ganaste.png");
const imgLose = require("url:../../../client/images/perdiste.png");
const imgDraw = require("url:../../../client/images/empate.png");
type Jugada = "piedra" | "papel" | "tijera";

customElements.define(
  "results-page",
  class ResultsPage extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      //obtengo el state
      const currentState = state.getState();
      // esto obtengo del state y lo seteo dependiendo si soy el owner o el guess
      let myState: any = currentState.myPlay;
      let rivalState: any = currentState.anotherPlayerPlay;
      const myPlay = document.createElement("div");
      const rivalPlay = document.createElement("div");
      const myPlayEl: any = this.querySelector(".my-play");
      const rivalPlayEl: any = this.querySelector(".rival-play");
      const resultsContainer: any = this.querySelector(".results-container");
      const imagen: any = this.querySelector(".imagen-result");
      const buttonEl: any = this.querySelector(".button-return-to-play");

      if (myState == "piedra") {
        myPlay.innerHTML = `
        <custom-piedra variant= "big" class= "my-play"></custom-piedra>
        `;
      }
      if (myState == "papel") {
        myPlay.innerHTML = `
        <custom-papel variant="big" class= "my-play"></custom-papel>
        `;
      }

      if (myState == "tijera") {
        myPlay.innerHTML = `
        <custom-tijera variant="big" class="my-play"></custom-tijera>
        `;
      }
      if (rivalState == "piedra") {
        rivalPlay.innerHTML = `
        <custom-piedra variant= "big" class= "rival-play"></custom-piedra>
        `;
      }
      if (rivalState == "papel") {
        rivalPlay.innerHTML = `
        <custom-papel variant= "big" class= "rival-play"></custom-papel>
        `;
      }
      if (rivalState == "tijera") {
        rivalPlay.innerHTML = `
        <custom-tijera variant= "big" class= "rival-play"></custom-tijera>
        `;
      }
      const intervalo = setInterval(() => 1000);
      setTimeout(() => {
        state.eleminarRtdbDataReady(() => {
          state.getHistory(() => {
          });
        });
        clearInterval(intervalo);
        if (
          currentState.whoIAmP1 == "owner" &&
          currentState.actualWhoWinP1 == "ganaste"
        ) {
          resultsContainer.style.display = "flex";
          resultsContainer.style.background = "#888949E5";
          imagen.src = imgWin;
        }
        if (
          currentState.whoIAmP1 == "owner" &&
          currentState.actualWhoWinP1 == "perdiste"
        ) {
          resultsContainer.style.display = "flex";
          resultsContainer.style.background = "rgba(137, 73, 73, 0.9)";
          imagen.src = imgLose;
        }
        if (
          currentState.whoIAmP1 == "owner" &&
          currentState.actualWhoWinP1 == "empataste"
        ) {
          resultsContainer.style.display = "flex";
          resultsContainer.style.background = "rgba(255, 233, 0, 0.7)";
          imagen.src = imgDraw;
        }
        if (
          currentState.whoIAmP1 == "guess" &&
          currentState.actualWhoWinP1 == "ganaste"
        ) {
          resultsContainer.style.display = "flex";
          resultsContainer.style.background = "rgba(137, 73, 73, 0.9)";
          imagen.src = imgLose;
        }
        if (
          currentState.whoIAmP1 == "guess" &&
          currentState.actualWhoWinP1 == "perdiste"
        ) {
          resultsContainer.style.display = "flex";
          resultsContainer.style.background = "#888949E5";
          imagen.src = imgWin;
        }
        if (
          currentState.whoIAmP1 == "guess" &&
          currentState.actualWhoWinP1 == "empataste"
        ) {
          resultsContainer.style.display = "flex";
          resultsContainer.style.background = "rgba(255, 233, 0, 0.7)";
          imagen.src = imgDraw;
        }
      }, 1000);
      buttonEl.addEventListener("click", () => {
        state.eleminarRtdbDataPlayers(() => {
          state.prueba(() => {
            Router.go("/instructions-page");
          });
        });
      });
      myPlayEl.appendChild(myPlay);
      rivalPlayEl.appendChild(rivalPlay);
    }
    render() {
      this.innerHTML = `
      <section class="container-all">
      <div class="rival-play"></div>
      <div class="my-play"></div>

      <section class="results-container">
        <div>
          <img class="imagen-result" src="${imgWin}"></img>
        </div>
        <div>
        <custom-score></custom-score>
        </div>
        <div class="container-buttons">
          <button-comp class="button-return-to-play">Volver a Jugar </button-comp>
        </div>
      </section>
    </section>
          `;
      const style = document.createElement("style");
      style.innerHTML = `
      *{
        box-sizing:border-box;
      }
      body{
        margin:0;
      }
      .imagen-result{
        max-width:230px;
        max-height:230px;
      }
      .container-all{

        display:flex;
        min-height:100vh;
        flex-direction:column;
        align-items:center;
      }
      .results-container{
        padding:20px;
        display:none;
        flex-direction:column;
        justify-content: space-between;
        align-items:center;
        position:absolute;
        min-width:375px;
        
        top:0px;
        bottom:0px;
        right:0px;
        left:0px;
      }
      .my-play{
        bottom:0px;
      }
      .rival-play{
        transform:rotate(180deg);
      }
  
      .button-return-to-play{
        width:100%;
      }
    `;
      this.appendChild(style);

      // this.addListeners();
    }
  }
);
