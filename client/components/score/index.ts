import { state } from "../../state";
export function initScore() {
  class initComp extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      const score = state.getScore();
      div.innerHTML = `
      <div class="container">
        <h3 class="title">Score</h3>
        <custom-text class="text" variant="body">Vos: ${score.myScore}</custom-text>
        <custom-text class="text" variant="body">Maquina: ${score.computerScore}</custom-text>
      </div>
      
      `;
      style.innerHTML = `
      .container{
          display:flex;
          flex-direction:column;
          border:solid black 5px;
          border-radius:2px;
          min-width:230px;
          min-height:190px;
          background-color:white;
          justify-content:space-between;
          gap:5px;
      }
      .title{
          margin:0;
          font-size:50px;
          text-align:center;
          color:black;
          font-family: var(--font-button);
      }
      .text{
          text-align:left;
          padding:2px;
          font-family: var(--font-button);
      }
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("custom-score", initComp);
}
