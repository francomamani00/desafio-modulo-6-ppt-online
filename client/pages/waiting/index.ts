import { Router } from "@vaadin/router";
import { state } from "./../../state";
customElements.define(
  "waiting-page",
  class Waiting extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      //   const buttonEl = this.querySelector(".instructions__button");
      //   if (state.getState().start && state.getState().anotherStart) {
      //     Router.go("/welcome");
      //   }
      const intevarlo = setInterval(() => {
        if (
          state.getState().anotherStart == true &&
          state.getState().start == true
        ) {
          //cs.anotherOnline == true nomas
          clearInterval(intevarlo);

          Router.go("/game");
        }
      }, 700);
    }
    render() {
      if (state.getState().whoIAmP1 == "owner") {
        this.innerHTML = `
        <section class="instructions__section">
          <div class="data-room">
              
              <div class= "container-name">
                <h3>${state.getState().nombre}:${
          state.getState().score.owner
        }</h3>
                <h3>${state.getState().anotherPlayer}:${
          state.getState().score.guess
        }</h3>
              </div>
              <div class = "container-room">
                <h3>Sala:</h3>
                <h3>${state.getState().roomId}</h3>
              </div>
              
          </div>
          <div class="instructions__container-title">
            <custom-text variant="subtitle">Esperando que ${
              state.getState().anotherPlayer
            } presione JUGAR
            </custom-text>
          </div>
        
        
        <div class="instructions__container-ppt">
        <custom-piedra variant="small" class="instructions__elementos"></custom-piedra>
        <custom-papel variant="small" class="instructions__elementos"></custom-papel>
        <custom-tijera variant="small" class="instructions__elementos"></custom-tijera>
        
        </div>
        
        </section>    
        `;
      } else if (state.getState().whoIAmP1 == "guess") {
        this.innerHTML = `
        <section class="instructions__section">
        <div class="data-room">
              
              <div class= "container-name">
                <h3>${state.getState().anotherPlayer}:${
          state.getState().score.guess
        }</h3>
                <h3>${state.getState().nombre}:${
          state.getState().score.owner
        }</h3>
              </div>
              <div class = "container-room">
                <h3>Sala</h3>
                <h3>${state.getState().roomId}</h3>
              </div>
              
          </div>
        <div class="instructions__container-title">
        <custom-text variant="subtitle">Esperando que ${
          state.getState().nombre
        } presione JUGAR</custom-text>
        </div>
        
        
        <div class="instructions__container-ppt">
        <custom-piedra variant="small" class="instructions__elementos"></custom-piedra>
        <custom-papel variant="small" class="instructions__elementos"></custom-papel>
        <custom-tijera variant="small" class="instructions__elementos"></custom-tijera>
        
        </div>
        
        </section>    
        `;
      }
      const style = document.createElement("style");
      style.innerHTML = `
      *{
        box-sizing:border-box;
      }
      body{
        margin:0;
      }
      .data-room{
        min-width:400px;
        min-height:150px;
        display:flex;
        flex-direction:row;
        justify-content:space-between;
      }
      h3{
        font-family: var(--font-button);
        margin:0px;
        font-size:25px;
      }
      .instructions__section{
        display:flex;
        width:100%;
        height:100vh;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
        padding-top:80px;
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
      // this.addListeners()
      //lo borre reciwen
    }
  }
);
