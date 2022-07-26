import * as express from "express";
// var express = require("express");
import { firestore } from "./db";
import { rtdb } from "./db";
import { json } from "body-parser";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";
import { map } from "lodash";
// import { nanoid } from "nanoid";
// import { nanoid } from "nanoid";
const app = express();
app.use(express.static("dist"));
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(cors());
const playersCollection = firestore.collection("players");
const roomCollection = firestore.collection("rooms");

app.get("/players", (req, res) => {
  res.json({
    message: {},
  });
});

app.get("/players/:playerId", (req, res) => {
  const playerId = req.params.playerId;
  const playerDoc = playersCollection.doc(playerId);
  playerDoc.get().then((snap) => {
    const playerData = snap.data();
    res.json(playerData);
  });
});

app.post("/players", (req, res) => {
  const newPlayerDoc = playersCollection.doc();
  newPlayerDoc.create(req.body).then(() => {
    res.status(201).json({
      id: newPlayerDoc.id,
    });
  });
});

app.post("/signup", (req, res) => {
  const nombre = req.body.nombre;
  playersCollection
    .where("nombre", "==", nombre)
    .get()
    .then((result) => {
      if (result.empty) {
        playersCollection
          .add({
            nombre: nombre,
          })
          .then((newPlayerRef) => {
            res.json({
              playerId: newPlayerRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "player already exists",
        });
      }
    });
});
app.post("/auth", (req, res) => {
  const { nombre } = req.body;
  playersCollection
    .where("nombre", "==", nombre)
    .get()
    .then((result) => {
      if (result.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          playerId: result.docs[0].id,
        });
      }
    });
});
app.post("/rooms", (req, res) => {
  const { playerId } = req.body;
  const { nombre } = req.body;
  playersCollection
    .doc(playerId.toString())
    .get()
    .then((doc) => {
      const roomRef = rtdb.ref("/rooms/" + uuidv4());
      console.log("player owner", doc.data(), "room", doc.id);
      if (doc.exists) {
        roomRef
          .set({
            players: [
              {
                nombre,
                playerId,
                online: true,
                playerPlay: "",
                start: "",
              },
              {
                nombre: "",
                playerId: "",
                online: false,
                playerPLay: "",
                start: "",
              },
            ],

            roomId: "",
            rtdbRoomId: "",
          })
          .then(() => {
            const longRoomId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomRef.update({ roomId: roomId, rtdbRoomId: longRoomId });

            roomCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: longRoomId,
                owner: nombre,
                history: [],
              })
              .then(() => {
                res.json({
                  roomId: roomId.toString(),
                  rtdbRoomId: longRoomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "do not exist",
        });
      }
    });
});

//crea al jugador 2 en la rtdb
//Con este post se crea un "jugador" en una room especifica
//
//un roomId como paraámetro este debe ser el roomIdReal el cual deberia estar guardado en el state
app.post("/rooms/:rtdbRoomId", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { nombre } = req.body;
  const { playerId } = req.body;
  const playersRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players");

  playersRef.once("value", (snapshot) => {
    console.log("players", snapshot.val());
    const players = snapshot.val();
    const playersList = map(players);
    console.log("playerlist[1]", playersList[1]);
    if (playersList[1].nombre != "") {
      res.status(400).json({
        message: "el room ya se encuentra lleno con:",
        players: playersList,
      });
    } else {
      const player2Ref = rtdb.ref("/rooms/" + rtdbRoomId + "/players/1");
      let playerAdded = { nombre, playerId, online: true };
      player2Ref.update(playerAdded);
      res.json({ message: "player added", playerAdded });
    }
    // if (playersList.length >= 2) {
    //   return res
    //     .status(400)
    //     .json({
    //       message: "el room ya se encuentra lleno con:",
    //       players: playersList,
    //     });
    // } else {
    //   res.json({ message: "puede entrar unop mas" });
    // }
    // else {
    //   const id = playersRef.push({
    //     nombre: nombre,
    //     playerId,
    //     online: true,
    //     playerPlay: "",
    //     start: "",
    //   }).key;
    //   res.json(id);
    // }
  });
});
//endpoint para obtener los jugadores de una rtdbRoomId ya creada
app.get("/rooms/:rtdbRoomId", (req, res) => {
  const { rtdbRoomId } = req.params;
  const playersRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players");
  playersRef.once("value", (snapshot) => {
    const players = snapshot.val();
    res.json(map(players));
  });
});
let contador = 0;

app.post("/rooms/:rtdbRoomId/players", (req, res) => {
  let myPlay = req.body.myPlay;
  let start = req.body.start;
  const rtdbRoomId = req.params.rtdbRoomId;
  const player = req.body;
  const newPlayer = [];

  if (player.aux == "start") {
    (myPlay = ""), (start = true);
  }
  const playerRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players");
  playerRef.once("value", (snapshot) => {
    const players = snapshot.val();
    const playersList = map(players);
    playersList.forEach((element: any, index) => {
      console.log("soy element", element);
      if (element.nombre == player.nombre) {
        newPlayer.push({
          nombre: player.nombre,
          playerId: player.playerId,
          roomId: player.roomId,
          online: true,
          myPlay: player.myPlay,
          start: start,
          serverId: index.toString(),
        });
      } else {
        newPlayer.push(element);
      }
    });
    playerRef.set(newPlayer).then((err) => {
      if (player.aux == "play") {
        contador++;
        if (contador == 2) {
          const player1 = {
            nombre: newPlayer[0].nombre,
            myPlay: newPlayer[0].myPlay,
          };
          const player2 = {
            nombre: newPlayer[1].nombre,
            myPlay: newPlayer[1].myPlay,
          };
          const jugada = { player1, player2 };
          let data;
          roomCollection
            .doc(newPlayer[0].roomId)
            .get()
            .then((snap) => {
              data = snap.data();
              data.history.push(jugada);

              roomCollection
                .doc(newPlayer[0].roomId)
                .set(data)
                .then(() => {});
            });
          contador = 0;
        }
      }
      res.json("terminado");
    });
  });
});
app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;

  roomCollection
    .doc(roomId)
    .get()
    .then((snap) => {
      const data = snap.data();
      res.json({
        data,
        message: "hola",
      });
    });
});
// const rutaRelativa = path.resolve(__dirname, "../dist/index.html");

// app.get("*", (req, res) => {
//     res.sendFile(rutaRelativa);
//   });
app.listen(port, () => {
  console.log(`example listening at http://localhost:${port}`);
});
