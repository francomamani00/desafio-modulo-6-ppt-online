export function initCustomText() {
  class TextComponent extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const variant = this.getAttribute("variant") || "body";
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      style.innerHTML = `
        .title{
            color: rgba(0, 144, 72, 1);
            padding: 0px;
            text-align: center;
            font-family: var(--font-button);
            font-size: 75px;
            font-weight: normal;
            font-weight: bold;
            margin: 0;
        }
        .subtitle{
          color: black;
          text-align: center;
          font-family: var(--font-button);
          font-size: 40px;
          font-weight: normal;
        }
        .body{
            font-size:40px;
        }
      `;
      div.className = variant;
      div.textContent = this.textContent;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("custom-text", TextComponent);
}
