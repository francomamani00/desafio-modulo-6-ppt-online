import { Router } from "@vaadin/router";
import { state } from "./../../state";
customElements.define(
  "share-id",
  class ShareId extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      let currentState = state.getState();
      this.render();
      this.addListeners();
    }
    addListeners() {
      const buttonEl = this.querySelector(".instruction__button");
      if (state.getState().whoIAmP1 == "owner") {
        const intervalo = setInterval(() => {
          if (state.getState().anotherPlayer != "") {
            //cs.anotherOnline == true nomas
            clearInterval(intervalo);
            console.log("res");
            Router.go("/instructions-page");
          } else {
            buttonEl.addEventListener("click", (e) => {
              console.log("aprete el boton");
              e.preventDefault();
              Router.go("/instructions-page");
            });
          }
        }, 500);
      } else if (state.getState().whoIAmP1 == "guess") {
        const intervalo1 = setInterval(() => {
          if (state.getState().anotherPlayer != "") {
            clearInterval(intervalo1);
            Router.go("/instructions-page");
          }
        }, 100);
      }
      // if (state.getState().anotherPlayer != "") {
      //   console.log("cambio anotherplayer, por lo tanto va a instructionspage");
      //   Router.go("/instructions-page");
      // } else {
      //   buttonEl?.addEventListener("click", (e) => {
      //     e.preventDefault();
      //     Router.go("/instructions-page");
      //   });
      // }
    }
    render() {
      this.innerHTML = `
    <section class="instructions__section">
      <div class="instructions__container-title">
        <custom-text variant="subtitle">Compartí el código con tu contricante:</custom-text>
        <custom-text variant="subtitle">${state.getState().roomId}</custom-text>
      </div>
      <div class="instructions__container-button">
          <button-comp class="instruction__button">Continuar</button-comp>
      </div>

      <div class="instructions__container-ppt">
          <custom-piedra variant="small" class="instructions__elementos"></custom-piedra>
          <custom-papel variant="small" class="instructions__elementos"></custom-papel>
          <custom-tijera variant="small" class="instructions__elementos"></custom-tijera>

      </div>

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
      .instructions__section{
        display:flex;
        width:100%;
        height:100vh;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
        padding-top:100px;
        padding-left: 20px;
        padding-right:20px;
      }
      .instructions__container-ppt{
        display:flex;
        gap:40px;
        flex-direction:row;
        justify-content:space-evenly;
        overflow:hidden;
        
    
      }
      .instructions__elementos {
        padding: 10px;
        position: relative;
        top:20px;
        width: fit-content;
      }
      @media (min-width: 556px){
          .instructions__elementos {
              top:64px;
            }
      }
      .instructions__container-title{
          padding:20px;
          max-width:650px;
          margin-top:50px;
      }
      .instructions__container-button{
        text-align:center;
        width:100%;
        margin-top:50px;
      }
        `;
      this.appendChild(style);
      // this.addListeners();
      // lo
    }
  }
);
