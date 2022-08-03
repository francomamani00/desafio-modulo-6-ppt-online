import { Router } from "@vaadin/router";
// import { state } from "../../state";
customElements.define(
  "welcome-page",
  class WelcomePage extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const newRoomEl = this.querySelector("#new-room");
      newRoomEl.addEventListener("click", (e) => {
        e.preventDefault;

        // state.askNewRoom();
        Router.go("/set-name");
      });
      const joinRoomEl = this.querySelector("#join-room");
      joinRoomEl.addEventListener("click", (e) => {
        e.preventDefault;
        Router.go("/connect-room");
      });
    }
    render() {
      this.innerHTML = `
        <section class="section">

            <div class="container-title">
                <custom-text variant="title">Piedra, Papel o Tijera</custom-text>
            </div>

            <div class="container-button">
                <button-comp class="button" id="new-room">Crear Sala</button-comp>
                <button-comp class="button" id="join-room">Ingresar a una sala</button-comp>

            </div>

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
        padding-top:70px;
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
          top:71px;
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
        margin-top:50px;
      }
      
      
      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
