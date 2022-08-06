import * as express from "express";
// var express = require("express");
import { firestore } from "./db";
import { rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";
import { map } from "lodash";
import * as path from "path";
// import { nanoid } from "nanoid";
// import { nanoid } from "nanoid";
const app = express();
app.use(express.static("dist"));
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(cors());
const playersCollection = firestore.collection("players");
const roomCollection = firestore.collection("rooms");
console.log("api holaa servidor");
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
        }
        else {
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
        }
        else {
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
        console.log("player owner", doc.data(), "playerid", doc.id, "room creado", roomRef.key);
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
                        playerPlay: "",
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
        }
        else {
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
        const players = snapshot.val();
        const playersList = map(players);
        if (playersList[1].nombre != "") {
            res.status(400).json({
                message: "el room ya se encuentra lleno con:",
                players: playersList,
            });
        }
        else {
            const player2Ref = rtdb.ref("/rooms/" + rtdbRoomId + "/players/1");
            let playerAdded = { nombre, playerId, online: true };
            player2Ref.update(playerAdded);
            res.json({ message: "player added", playerAdded });
        }
    });
});
//este endpoint no lo uso
// app.post("/rooms/:rtdbRoomId/players", (req, res) => {
//   let myPlay = req.body.myPlay;
//   let start = req.body.start;
//   const rtdbRoomId = req.params.rtdbRoomId;
//   const player = req.body;
//   const newPlayer = [];
//   if (player.aux == "start") {
//     (myPlay = ""), (start = true);
//   }
//   const playerRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players");
//   playerRef.once("value", (snapshot) => {
//     const players = snapshot.val();
//     const playersList = map(players);
//     playersList.forEach((element: any, index) => {
//       console.log("soy element", element);
//       if (element.nombre == player.nombre) {
//         newPlayer.push({
//           nombre: player.nombre,
//           playerId: player.playerId,
//           roomId: player.roomId,
//           online: true,
//           myPlay: player.myPlay,
//           start: start,
//           serverId: index.toString(),
//         });
//       } else {
//         newPlayer.push(element);
//       }
//     });
//     playerRef.set(newPlayer).then((err) => {
//       if (player.aux == "play") {
//         contador++;
//         if (contador == 2) {
//           const player1 = {
//             nombre: newPlayer[0].nombre,
//             myPlay: newPlayer[0].myPlay,
//           };
//           const player2 = {
//             nombre: newPlayer[1].nombre,
//             myPlay: newPlayer[1].myPlay,
//           };
//           const jugada = { player1, player2 };
//           let data;
//           roomCollection
//             .doc(newPlayer[0].roomId)
//             .get()
//             .then((snap) => {
//               data = snap.data();
//               data.history.push(jugada);
//               roomCollection
//                 .doc(newPlayer[0].roomId)
//                 .set(data)
//                 .then(() => {});
//             });
//           contador = 0;
//         }
//       }
//       res.json("terminado");
//     });
//   });
// });
app.get("/rooms/:roomId", (req, res) => {
    const { playerId } = req.query;
    const { roomId } = req.params;
    playersCollection
        .doc(playerId.toString())
        .get()
        .then((doc) => {
        if (doc.exists) {
            roomCollection
                .doc(roomId)
                .get()
                .then((snap) => {
                const data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                messages: "noexistis",
            });
        }
    });
});
//endpoint para obtener history, lo uso en la page game
app.get("/history/:roomId", (req, res) => {
    const { roomId } = req.params;
    let data;
    roomCollection
        .doc(roomId)
        .get()
        .then((snap) => {
        data = snap.data();
        res.json(data);
    });
});
//endpoint para cambiar player 1
app.post("/change-data-player1/:rtdbRoomId", (req, res) => {
    const { rtdbRoomId } = req.params;
    const playersRef1 = rtdb.ref("/rooms/" + rtdbRoomId + "/players/0");
    playersRef1.update(req.body, function (err) {
        console.log(err);
        res.json("player1 cambio start:true");
    });
});
//endpoint para cambiar player 2
app.post("/change-data-player2/:rtdbRoomId", (req, res) => {
    const { rtdbRoomId } = req.params;
    const playersRef2 = rtdb.ref("/rooms/" + rtdbRoomId + "/players/1");
    playersRef2.update(req.body, function (err) {
        console.log(err);
        res.json("player2 cambio start:true");
    });
});
const rutaRelativa = path.resolve(__dirname, "../dist/index.html");
app.get("*", (req, res) => {
    res.sendFile(rutaRelativa);
});
app.listen(port, () => {
    console.log(`example listening at http://localhost:${port}`);
});
