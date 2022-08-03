import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "game-page",
  class GamePage extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const cs = state.getState();
      const handComponents = this.querySelectorAll("#pointer");
      let contador: any = this.querySelector(".contador");
      let boolean = false;
      handComponents.forEach((hand) => {
        hand.addEventListener("click", (e: any) => {
          boolean = true;
          const type = hand.getAttribute("tipo");
          if (cs.whoIAmP1 == "owner") {
            if (type == "piedra") {
              console.log("elegiste piedra del owner");
              state.setMove(type);
              //   cs.myPlay == type;
              state.setMovePlayer1(type, () => {
                state.changePlayerPlayPlayer1(() => {});
              });
            } else if (type == "papel") {
              console.log("elegiste papel del owner");
              state.setMove(type);

              //   cs.myPlay == type;
              state.setMovePlayer1(type, () => {
                state.changePlayerPlayPlayer1(() => {});
              });
            } else if (type == "tijera") {
              console.log("elegiste tijera del owner");
              state.setMove(type);

              //   cs.myPlay == type;
              state.setMovePlayer1(type, () => {
                state.changePlayerPlayPlayer1(() => {});
              });
            }

            const currentState = state.getState();

            // state.changePlayerPlayPlayer1();
          } else if (cs.whoIAmP1 == "guess") {
            if (type == "piedra") {
              console.log("elegiste piedra del guess");
              state.setMove(type);

              //   cs.anotherPlayerPlay == type;
              state.setMovePlayer2(type, () => {
                state.changePlayerPlayPlayer2(() => {});
              });
            } else if (type == "papel") {
              console.log("elegiste papel del guess");
              state.setMove(type);

              //   cs.anotherPlayerPlay == type;
              state.setMovePlayer2(type, () => {
                state.changePlayerPlayPlayer2(() => {});
              });
            } else if (type == "tijera") {
              console.log("elegiste tijera del guess");
              state.setMove(type);

              //   cs.anotherPlayerPlay == type;
              state.setMovePlayer2(type, () => {
                state.changePlayerPlayPlayer2(() => {});
              });
            }
          }
          const intervalo = setInterval(() => {
            if (
              state.getState().myPlay != "" &&
              state.getState().anotherPlayerPlay != ""
            ) {
              clearInterval(intervalo);
              console.log("AMBOS JUGADORES YA JUGARON!!!");

              state.getHistory(() => {
                state.getScore(() => {
                  Router.go("/results");
                });
              });
            }
          }, 3000);
          //   state.changePlayerPlayPlayer2();

          //   state.setState(cs);
          //s
          // if (type == "piedra") {
          //   state.setMove("piedra", () => console.log(cs));
          // } else if (type == "papel") {
          //   state.setMove("papel", () => console.log(cs));
          // } else if (type == "tijera") {
          //   state.setMove("tijera", () => console.log(cs));
          // }
        });
      });

      contador.addEventListener("change", (e: any) => {
        if (
          boolean == false ||
          cs.anotherPlayerPlay == "" ||
          cs.playerPLay == ""
        ) {
          cs.myPlay = "";
          state.eleminarRtdbDataReady(() => {
            state.eleminarRtdbDataPlayers(() => {
              Router.go("/instructions-page");
            });
          });
        }
      });
    }
    render() {
      this.innerHTML = `
      <section class="game__section">
        <div class="game__container-contador">
            <contador-comp class="contador"></contador-comp>
        </div>
        <div class="game__container-ppt">
            <custom-piedra tipo="piedra"variant="small" id="pointer" class="elementos"></custom-piedra>
            <custom-papel tipo="papel" variant="small" id="pointer" class="elementos"></custom-papel>
            <custom-tijera tipo="tijera" variant="small" id="pointer" class="elementos"></custom-tijera>
        </div>
    </section>
          `;
      const style = document.createElement("style");
      style.innerHTML = `*{
        box-sizing:border-box;
      }
      body{
        margin:0;
      }
      .game__section{
        
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
      .game__container-contador{
        
      }
      .game__container-ppt{
        display:flex;
        gap:40px;
        flex-direction:row;
        overflow:hidden;
  
      }
      .elementos{
        position:relative;
        top:60px;
        cursor:pointer;
        padding:10px;
      }
  
    `;
      this.appendChild(style);
      // this.addListeners();
    }
  }
);
