import { rtdb } from "./rtdb";
import { ref, onValue } from "firebase/database";
import map from "lodash";
import { callbackify } from "util";
const API_BASE_URL = "http://localhost:3000";
type Jugada = "piedra" | "tijera" | "papel";

const state = {
  data: {
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
    history: [],
    listeners: [],
  },

  init() {
    const localData: any = localStorage.getItem("saved-state");
    if (JSON.parse(localData) != null) {
      this.data = JSON.parse(localData);
    }
  },
  listenRoom(cb) {
    const currentState = this.getState();
    const roomRef = ref(rtdb, "/rooms/" + currentState.rtdbRoomId + "/players");
    onValue(roomRef, (snapshot) => {
      const players = snapshot.val();
      const playersList = map(players);
      //esto invente yo
      console.log(players[1]);
      if (players[1].nombre != "") {
        currentState.anotherPlayer = players[1].nombre;
        currentState.anotherPlayerId = players[1].playerId;
        currentState.anotherPlayerOnline = players[1].online;
        currentState.anotherPlayerPlay = players[1].myPlay;
        currentState.anotherStart = players[1].start;
      }
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
          console.log("signin", currentState);
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
          rtdbRoomId: currentState.rtdbRoomId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.online = true;
          currentState.roomId = data.roomId;
          currentState.rtdbRoomId = data.rtdbRoomId;
          if (cb) {
            cb();
          }
        });
    } else {
      console.error("nohay id");
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
        this.listenRoom();
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
        nombre: currentState.anotherPlayer,
        playerId: currentState.anotherPlayerId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.serverId = data;
        console.log("server id del state", currentState.serverId);
        cb();
      });
  },
  changeStart(auxiliar, cb) {
    const currentState = state.getState();

    const rtdbRoomId = currentState.rtdbRoomId;

    console.log("/rooms/" + rtdbRoomId + "/players");
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

  setMove(move: Jugada) {
    const currentState = state.getState();
    currentState.myPlay = move;

    this.changeStart();
  },
  getHistory(cb) {
    const currentState = state.getState();

    fetch("/rooms/" + currentState.roomId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.history = data.history;
      });
    if (cb) cb();
  },
  getScore(cb) {
    let scorePlayerOne = 0;
    let scorePlayerTwo = 0;
    let currentState = this.getState();
    let history = this.data.history;
    console.log(history);
    for (const s of history) {
      if (currentState.nombre == s.player1.nombre) {
        if (
          this.whoWins(s.player1.myPlay, s.player2.computerPlay) == "ganaste"
        ) {
          scorePlayerOne++;
        }
        if (
          this.whoWins(s.player1.myPlay, s.player2.computerPlay) == "perdiste"
        ) {
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
    currentState.myScore = scorePlayerOne;
    currentState.anotherScore = scorePlayerTwo;
    state.pushToHistory();
    if (cb) cb();
    return { scorePlayerOne, scorePlayerTwo };
  },
  whoWins(myPlay: Jugada, anotherPlayerPlay: Jugada) {
    if (myPlay == "piedra") {
      if (anotherPlayerPlay == "papel") {
        return "perdiste";
      }
      if (anotherPlayerPlay == "tijera") {
        return "ganaste";
      }
      if (anotherPlayerPlay == "piedra") {
        return "empataste";
      }
    }

    if (myPlay == "papel") {
      if (anotherPlayerPlay == "tijera") {
        return "perdiste";
      }
      if (anotherPlayerPlay == "piedra") {
        return "ganaste";
      }
      if (anotherPlayerPlay == "papel") {
        return "empataste";
      }
    }
    if (myPlay == "tijera") {
      if (anotherPlayerPlay == "piedra") {
        return "perdiste";
      }
      if (anotherPlayerPlay == "papel") {
        return "ganaste";
      }
      if (anotherPlayerPlay == "tijera") {
        return "empataste";
      }
    }
  },
  pushToHistory() {
    const currentState = this.getState();
    localStorage.setItem("saved-state", JSON.stringify(currentState));
  },
  prueba(cb) {
    console.log("si llega a la prueba");
    if (cb) cb();
  },
};

export { state, Jugada };
