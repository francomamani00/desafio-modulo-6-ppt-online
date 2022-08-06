import { rtdb } from "./rtdb";
import { ref, onValue } from "firebase/database";
import map from "lodash/map";
// import { callbackify } from "util";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
type Jugada = "piedra" | "tijera" | "papel";
type WhoIAm = "owner" | "guess";
const state = {
  data: {
    whoIAmP1: "",
    originalPlay: "",
    actualWhoWinP1: "",
    nombre: "",
    playerId: "",
    online: "",
    start: "",
    myPlay: "",
    myScore: "",
    roomId: "",
    rtdbRoomId: "",
    anotherPlayer: "",
    anotherPlayerId: "",
    anotherPlayerOnline: "",
    anotherStart: "",
    anotherPlayerPlay: "",
    anotherScore: "",
    serverKey: "",
    serverId: "",
    listeners: [],
    history: [],
    score: {
      owner: 0,
      guess: 0,
      empates: 0,
    },
  },

  init() {
    const localData: any = localStorage.getItem("saved-state");
    if (JSON.parse(localData) != null) {
      this.data = JSON.parse(localData);
    }
  },
  listenRoom(cb?) {
    const currentState = this.getState();
    const roomRef = ref(rtdb, "/rooms/" + currentState.rtdbRoomId + "/players");
    onValue(roomRef, (snapshot) => {
      const players = snapshot.val();
      const playersList = map(players);
      //esto invente yo
      console.log("jugadoresssss", players);

      playersList.forEach((element, index) => {
        if (element.nombre != currentState.nombre) {
          currentState.anotherPlayer = players[1].nombre;
          currentState.anotherPlayerId = players[1].playerId;
          currentState.anotherPlayerOnline = players[1].online;
          currentState.anotherPlayerPlay = players[1].playerPlay;
          currentState.anotherStart = players[1].start;
          currentState.nombre = players[0].nombre;
          currentState.playerId = players[0].playerId;
          currentState.online = players[0].online;
          currentState.myPlay = players[0].playerPlay;
          currentState.start = players[0].start;
        }
      });

      // playersList.forEach((element, index) => {
      //   if (element.nombre == currentState.nombre) {
      //     currentState.serverId = index.toString();
      //   }
      //   if (element.nombre != currentState.nombre) {
      //     currentState.anotherPlayer = element.nombre;
      //     currentState.anotherPlayerId = element.playerId;
      //     currentState.anotherPlayerOnline = element.online;
      //     currentState.anotherPlayerPlay = element.myPlay;
      //     currentState.anotherStart = element.start;
      //   }
      // });
      this.setState(currentState);
      this.pushToHistory();
    });
    if (cb) cb();
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    console.log("soy el state, he cambiado", this.data);
    this.pushToHistory();
  },
  cleanState() {
    localStorage.setItem(
      "saved-state",
      JSON.stringify({
        myPlay: 0,
        computerPlay: 0,
      })
    );
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  setNombre(nombre: string) {
    const currentState = this.getState();
    currentState.nombre = nombre;
  },
  signup(cb) {
    const currentState = this.getState();
    fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ nombre: currentState.nombre }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.playerId = data.playerId;
        cb();
      });
  },
  signupPlayer2(cb) {
    const currentState = this.getState();
    fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ nombre: currentState.anotherPlayer }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // currentState.anotherPlayerId = data.playerId;
        cb();
      });
  },

  signin(cb) {
    const currentState = this.getState();
    if (currentState.nombre) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: currentState.nombre }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.playerId = data.playerId;

          cb();
        });
    } else {
      cb(true);
    }
  },
  signinPlayer2(cb) {
    const currentState = this.getState();
    if (currentState.anotherPlayer) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: currentState.anotherPlayer }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.anotherPlayerId = data.playerId;
          cb();
        });
    } else {
      cb(true);
    }
  },
  setOwner(whoIAm: WhoIAm, cb) {
    const cs = this.getState();
    cs.whoIAmP1 = whoIAm;
    this.setState(cs);
    if (cb) cb();
  },
  setGuess(whoIAm: WhoIAm, cb) {
    const cs = this.getState();
    cs.whoIAmP1 = whoIAm;
    this.setState(cs);
    if (cb) cb();
  },
  askNewRoom(cb?) {
    const currentState = this.getState();
    if (currentState.playerId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          playerId: currentState.playerId,
          nombre: currentState.nombre,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.online = true;

          currentState.roomId = data.roomId;
          // currentState.rtdbRoomId = data.rtdbRoomId;

          // this.setState(currentState);
          if (cb) {
            cb();
          }
        });
    } else {
      console.error("no hay id");
    }
  },

  accessToRoom(cb?) {
    const currentState = this.getState();
    const roomId = currentState.roomId;
    fetch(
      API_BASE_URL + "/rooms/" + roomId + "?playerId=" + currentState.playerId
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.rtdbRoomId = data.rtdbRoomId;
        // this.setState(currentState);
        // this.listenRoom();

        if (cb) cb();
      });
  },

  addPlayerDos(cb) {
    const currentState = state.getState();
    const rtdbRoomId = currentState.rtdbRoomId;
    fetch(API_BASE_URL + "/rooms/" + rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nombre: currentState.nombre,
        playerId: currentState.playerId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.serverId = data;

        cb();
      });
  },
  changeStartPlayer1() {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;

    fetch(API_BASE_URL + "/change-data-player1/" + `${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start: true,
      }),
    });
    currentState.start = true;
    this.setState(currentState);
  },
  changeStartPlayer2() {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;

    fetch(API_BASE_URL + "/change-data-player2/" + `${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start: true,
      }),
    });
    currentState.anotherStart = true;
    this.setState(currentState);
  },
  eleminarRtdbDataReady(cb) {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;

    fetch(API_BASE_URL + "/change-data-player1/" + `${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start: false,
      }),
    });
    fetch(API_BASE_URL + "/change-data-player2/" + `${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start: false,
      }),
    });
    currentState.start = false;
    currentState.anotherStart = false;
    this.setState(currentState);
    if (cb) cb();
  },
  //no lo uso a este endpoint
  changeStart(auxiliar, cb) {
    const currentState = state.getState();

    const rtdbRoomId = currentState.rtdbRoomId;

    fetch(API_BASE_URL + "/rooms/" + rtdbRoomId + "/players", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nombre: currentState.nombre,
        playerId: currentState.playerId,
        serverId: currentState.serverId,
        online: currentState.online,
        aux: auxiliar,
        start: currentState.start,
        roomId: currentState.roomId,
        myPlay: currentState.myPlay,
      }),
    })
      .then((res) => {
        console.log("soy res", res);
        return res.json();
      })
      .then((data) => {
        console.log(data, "soy data!");
        console.log(currentState.serverId);
        if (cb) cb();
      });
  },

  setMove(move: Jugada, cb?) {
    const currentState = state.getState();
    currentState.originalPlay = move;
    // this.setState();
    // this.changeStart();
    if (cb) cb();
  },
  setMovePlayer1(move: Jugada, cb) {
    const currentState = this.getState();
    console.log(currentState);
    currentState.myPlay = move;
    // this.setState();

    if (cb) cb();
  },
  setMovePlayer2(move: Jugada, cb) {
    const currentState = this.getState();
    currentState.anotherPlayerPlay = move;
    // this.setState();
    console.log("setmoveplayer2", currentState);
    if (cb) cb();
  },
  changePlayerPlayPlayer1(cb) {
    const currentState = this.getState();

    const rtdbRoomId = currentState.rtdbRoomId;

    fetch(API_BASE_URL + "/change-data-player1/" + `${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playerPlay: currentState.myPlay,
      }),
    });
    if (cb) cb();
  },
  changePlayerPlayPlayer2(cb) {
    const currentState = this.getState();

    const rtdbRoomId = currentState.rtdbRoomId;

    fetch(API_BASE_URL + "/change-data-player2/" + `${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playerPlay: currentState.anotherPlayerPlay,
      }),
    });
    if (cb) cb();
  },
  //funcion para eliminar la data si es q se acaba el tiempo y uno o ambos jugadores no jugaron
  eleminarRtdbDataPlayers(cb?) {
    const cs = this.getState();
    const rtdbRoomId = cs.rtdbRoomId;

    fetch(API_BASE_URL + "/change-data-player1/" + `${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playerPlay: "",
      }),
    });
    fetch(API_BASE_URL + "/change-data-player2/" + `${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playerPlay: "",
      }),
    });
    cs.myPlay = "";
    cs.anotherPlayerPlay = "";
    this.setState(cs);
    if (cb) cb();
  },
  getHistory(cb?) {
    const currentState = state.getState();

    fetch(API_BASE_URL + "/history/" + currentState.roomId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.history = data.history;
      });
    if (cb) cb();
  },
  //NO USO ESTO POR AHORA
  // getScoreDeFirebase(cb?) {
  //   const currentState = state.getState();

  //   fetch(API_BASE_URL + "/history/" + currentState.roomId)
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       currentState.score.player1 = data.scorePlayer1;
  //       currentState.score.player2 = data.scorePlayer2;

  //       console.log("lista vacia de history", currentState.history);
  //     });
  //   if (cb) cb();
  // },
  //NO USO ESTO POR AHORA
  // changeScoreDelFirebase(callback, scoreP1, scoreP2) {
  //   const cs = this.getState();
  //   const roomId = cs.roomId;
  //   // let scoreP1 = cs.history.player1;
  //   // let scoreP2 = cs.history.player2;

  //   fetch(`${API_BASE_URL}/rooms/score`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ id: roomId, player1: scoreP1, player2: scoreP2 }),
  //   })
  //     .then(data => {
  //       return data.json();
  //     })
  //     .then(res => {
  //       this.getScore(callback);
  //       return res;
  //     });
  // },
  getScore(cb?) {
    let scorePlayerOne = 0;
    let scorePlayerTwo = 0;
    let currentState = this.getState();
    let history = this.data.history;

    for (const s of history) {
      if (currentState.nombre == s.player1.nombre) {
        if (this.whoWins(s.player1.myPlay, s.player2.myPlay) == "ganaste") {
          scorePlayerOne++;
        }
        if (this.whoWins(s.player1.myPlay, s.player2.myPlay) == "perdiste") {
          scorePlayerTwo++;
        }
      }
      if (currentState.nombre == s.player2.nombre) {
        console.log("s22", s.player2);
        if (this.whoWins(s.player2.myPlay, s.player1.myPlay) == "ganaste") {
          scorePlayerOne++;
        }
        if (this.whoWins(s.player2.myPlay, s.player1.myPlay) == "perdiste") {
          scorePlayerTwo++;
        }
      }
    }
    if (
      this.whoWins(currentState.myPlay, currentState.anotherPlayerPlay) ==
      "ganaste"
    ) {
      scorePlayerOne++;
    }
    if (
      this.whoWins(currentState.myPlay, currentState.anotherPlayerPlay) ==
      "perdiste"
    ) {
      scorePlayerTwo++;
    }
    if (currentState.actualWhoWinP1 == "ganaste") {
      currentState.score.owner = currentState.score.owner + 1;
    }
    if (currentState.actualWhoWinP1 == "perdiste") {
      currentState.score.guess = currentState.score.guess + 1;
    }
    if (currentState.actualWhoWinP1 == "empataste") {
      currentState.score.empates = currentState.score.empates + 1;
    }
    // currentState.score.player1 = scorePlayerOne;
    // currentState.score.player2 = scorePlayerTwo;
    currentState.myScore = scorePlayerOne;
    currentState.anotherScore = scorePlayerTwo;
    state.pushToHistory();
    if (cb) cb();
  },
  whoWins(myPlay: Jugada, anotherPlayerPlay: Jugada) {
    let currentState = this.getState();
    if (myPlay == "piedra") {
      if (anotherPlayerPlay == "papel") {
        currentState.actualWhoWinP1 = "perdiste";
        return "perdiste";
      }
      if (anotherPlayerPlay == "tijera") {
        currentState.actualWhoWinP1 = "ganaste";

        return "ganaste";
      }
      if (anotherPlayerPlay == "piedra") {
        currentState.actualWhoWinP1 = "empataste";

        return "empataste";
      }
    }

    if (myPlay == "papel") {
      if (anotherPlayerPlay == "tijera") {
        currentState.actualWhoWinP1 = "perdiste";

        return "perdiste";
      }
      if (anotherPlayerPlay == "piedra") {
        currentState.actualWhoWinP1 = "ganaste";

        return "ganaste";
      }
      if (anotherPlayerPlay == "papel") {
        currentState.actualWhoWinP1 = "empataste";

        return "empataste";
      }
    }
    if (myPlay == "tijera") {
      if (anotherPlayerPlay == "piedra") {
        currentState.actualWhoWinP1 = "perdiste";

        return "perdiste";
      }
      if (anotherPlayerPlay == "papel") {
        currentState.actualWhoWinP1 = "ganaste";

        return "ganaste";
      }
      if (anotherPlayerPlay == "tijera") {
        currentState.actualWhoWinP1 = "empataste";

        return "empataste";
      }
    }
    this.setState(currentState);
  },
  pushToHistory() {
    const currentState = this.getState();
    localStorage.setItem("saved-state", JSON.stringify(currentState.score));
  },
  prueba(cb) {
    console.log("si llega a la prueba");
    if (cb) cb();
  },
};

export { state, Jugada };
