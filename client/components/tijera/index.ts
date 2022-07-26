const tijera = require("url:../../../client/images/tijera.png");
export function initTijera() {
  class TijeraComponent extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const variant = this.getAttribute("variant") || "small";
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.innerHTML = `
        <img variant="big" class="tijera" src="${tijera}">
      `;
      style.innerHTML = `
            .big{
                width: 157px;
                height:300px;
            }
            .small{
                width:110px;
                height:230px;
            }
            .tijera{
                width: 100%;
                object-fit: contain;
            }
        `;

      div.className = variant;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("custom-tijera", TijeraComponent);
}
