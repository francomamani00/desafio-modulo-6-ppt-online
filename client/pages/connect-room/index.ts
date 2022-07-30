import { Router } from "@vaadin/router";
import { createNoSubstitutionTemplateLiteral } from "typescript";
import { state } from "./../../state";
import { ref } from "firebase/database";
import { rtdb } from "./../../rtdb";
customElements.define(
  "connect-room",
  class SetPage extends HTMLElement {
    shadowRoot: ShadowRoot;
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const formEl = this.querySelector("#form");
      const buttonEl = this.querySelector(".connect-room__button");
      const currentState = state.getState();
      const roomRef = ref(rtdb, "/rooms");

      buttonEl?.addEventListener("click", (e) => {
        e.preventDefault();
        formEl?.dispatchEvent(new Event("submit"));
      });
      formEl?.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;
        currentState.roomId = target.input__codigo.value;
        currentState.nombre = target.input__name.value;

        state.signup(() => {
          console.log("set-name -> signup");
          state.signin(() => {
            console.log("set-name -> signin");
            state.accessToRoom(() => {
              console.log("set-name -> accesstoroom");
              state.addPlayerDos(() => {
                state.listenRoom(() => {
                  Router.go("/instructions-page");
                  console.log("connectroom-state", currentState);
                });
              });
            });
          });
        });
      });
    }
    render() {
      this.innerHTML = `
          <section class="section">
  
              <div class="container-title">
                  <custom-text variant="title">Piedra, Papel o Tijera</custom-text>
              </div>
              
              <form class="connect-room__form-container form " id="form">
                <div>
                    <custom-text variant="subtitle">Ingresa tu nombre:</custom-text>
                </div>
                <input name="input__name" placeholder="Nombre:"required class="name__input" type="text"></input>
                <div>
                    <custom-text variant="subtitle">Ingresa la sala:</custom-text>
                </div>
                <input name="input__codigo" placeholder="Codigo:"required class="codigo__input" type="text"></input>
                <div class="container-button"> 
                    <button-comp class="connect-room__button" id="join-room">Ingresar a una sala</button-comp> 
                </div>
              </form>
  
              <div class="container-ppt">
                  <custom-piedra variant="small" class="elementos"></custom-piedra>
                  <custom-papel variant="small" class="elementos"></custom-papel>
                  <custom-tijera variant="small" class="elementos"></custom-tijera>
              </div>
  
          </section>
          
          
          `;
      const style = document.createElement("style");
      style.innerHTML = `
        .section{
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
        .container-ppt{
          display:flex;
          gap:40px;
          flex-direction:row;
          justify-content:space-evenly;
          overflow:hidden;
        }
        .elementos {
          padding: 10px;
          position: relative;
          top:25px;
          width: fit-content;
        }
        @media (min-width:512px){
          .elementos{
            top:30px;
          }
        }
        .container-title{
            margin-top:30px;
        }
        .container-button{
          display:flex;
          flex-direction:column;
          gap:20px;
          text-align:center;
          margin-top:10px;
        }
        .form{
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap:15px;
          margin-top:20px;
        }
        .name__input, .codigo__input{
            min-width:280px;
            max-width: 300px;
            height:87px;           
            background-color: #fff;
            border:solid 10px #001997;
            border-radius:10px;
            font-size: 45px;
            font-family: var(--font-button);
            text-align:center;
            
        }
        `;
      this.appendChild(style);
    }
  }
);
