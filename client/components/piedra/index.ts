const piedra = require("url:../../../client/images/piedra.png");
export function initPiedra() {
  class PiedraComponent extends HTMLElement {
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
        <img variant="big" class="piedra" src="${piedra}">
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
            .piedra{
                width: 100%;
            }
        `;

      div.className = variant;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("custom-piedra", PiedraComponent);
}
