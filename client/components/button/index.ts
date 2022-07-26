export function initButton() {
  class Button extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const button = document.createElement("button");
      const style = document.createElement("style");
      button.className = "root";
      style.innerHTML = `
        .root{
            min-width:300px;
            max-width: 332px;
            height:87px;
            color: #fff;
            max-width: 500px;
            height: 87px;
            background-color: #006CFC;
            border:solid 10px #001997;
            border-radius:10px;
            font-size: 45px;
            font-family: var(--font-button);
            text-align:center;
            cursor:pointer;
        }
      
      `;
      button.textContent = this.textContent;
      shadow.appendChild(button);
      shadow.appendChild(style);
    }
  }
  customElements.define("button-comp", Button);
}
