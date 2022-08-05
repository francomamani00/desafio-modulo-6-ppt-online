"use strict";
exports.__esModule = true;
var express = require("express");
// var express = require("express");
var db_1 = require("./db");
var db_2 = require("./db");
var uuid_1 = require("uuid");
var cors = require("cors");
var lodash_1 = require("lodash");
var path = require("path");
// import { nanoid } from "nanoid";
// import { nanoid } from "nanoid";
var app = express();
app.use(express.static("dist"));
app.use(express.json());
var port = process.env.PORT || 3000;
app.use(cors());
var playersCollection = db_1.firestore.collection("players");
var roomCollection = db_1.firestore.collection("rooms");
console.log("api holaa indexts");
app.get("/players", function (req, res) {
    res.json({
        message: {}
    });
});
app.get("/players/:playerId", function (req, res) {
    var playerId = req.params.playerId;
    var playerDoc = playersCollection.doc(playerId);
    playerDoc.get().then(function (snap) {
        var playerData = snap.data();
        res.json(playerData);
    });
});
app.post("/players", function (req, res) {
    var newPlayerDoc = playersCollection.doc();
    newPlayerDoc.create(req.body).then(function () {
        res.status(201).json({
            id: newPlayerDoc.id
        });
    });
});
app.post("/signup", function (req, res) {
    var nombre = req.body.nombre;
    playersCollection
        .where("nombre", "==", nombre)
        .get()
        .then(function (result) {
        if (result.empty) {
            playersCollection
                .add({
                nombre: nombre
            })
                .then(function (newPlayerRef) {
                res.json({
                    playerId: newPlayerRef.id,
                    "new": true
                });
            });
        }
        else {
            res.status(400).json({
                message: "player already exists"
            });
        }
    });
});
app.post("/auth", function (req, res) {
    var nombre = req.body.nombre;
    playersCollection
        .where("nombre", "==", nombre)
        .get()
        .then(function (result) {
        if (result.empty) {
            res.status(404).json({
                message: "not found"
            });
        }
        else {
            res.json({
                playerId: result.docs[0].id
            });
        }
    });
});
app.post("/rooms", function (req, res) {
    var playerId = req.body.playerId;
    var nombre = req.body.nombre;
    playersCollection
        .doc(playerId.toString())
        .get()
        .then(function (doc) {
        var roomRef = db_2.rtdb.ref("/rooms/" + (0, uuid_1.v4)());
        console.log("player owner", doc.data(), "playerid", doc.id, "room creado", roomRef.key);
        if (doc.exists) {
            roomRef
                .set({
                players: [
                    {
                        nombre: nombre,
                        playerId: playerId,
                        online: true,
                        playerPlay: "",
                        start: ""
                    },
                    {
                        nombre: "",
                        playerId: "",
                        online: false,
                        playerPlay: "",
                        start: ""
                    },
                ],
                roomId: "",
                rtdbRoomId: ""
            })
                .then(function () {
                var longRoomId = roomRef.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                roomRef.update({ roomId: roomId, rtdbRoomId: longRoomId });
                roomCollection
                    .doc(roomId.toString())
                    .set({
                    rtdbRoomId: longRoomId,
                    owner: nombre,
                    history: []
                })
                    .then(function () {
                    res.json({
                        roomId: roomId.toString(),
                        rtdbRoomId: longRoomId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "do not exist"
            });
        }
    });
});
//crea al jugador 2 en la rtdb
//Con este post se crea un "jugador" en una room especifica
//
//un roomId como paraámetro este debe ser el roomIdReal el cual deberia estar guardado en el state
app.post("/rooms/:rtdbRoomId", function (req, res) {
    var rtdbRoomId = req.params.rtdbRoomId;
    var nombre = req.body.nombre;
    var playerId = req.body.playerId;
    var playersRef = db_2.rtdb.ref("/rooms/" + rtdbRoomId + "/players");
    playersRef.once("value", function (snapshot) {
        var players = snapshot.val();
        var playersList = (0, lodash_1.map)(players);
        if (playersList[1].nombre != "") {
            res.status(400).json({
                message: "el room ya se encuentra lleno con:",
                players: playersList
            });
        }
        else {
            var player2Ref = db_2.rtdb.ref("/rooms/" + rtdbRoomId + "/players/1");
            var playerAdded = { nombre: nombre, playerId: playerId, online: true };
            player2Ref.update(playerAdded);
            res.json({ message: "player added", playerAdded: playerAdded });
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
app.get("/rooms/:roomId", function (req, res) {
    var playerId = req.query.playerId;
    var roomId = req.params.roomId;
    playersCollection
        .doc(playerId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            roomCollection
                .doc(roomId)
                .get()
                .then(function (snap) {
                var data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                messages: "noexistis"
            });
        }
    });
});
//endpoint para obtener history, lo uso en la page game
app.get("/history/:roomId", function (req, res) {
    var roomId = req.params.roomId;
    var data;
    roomCollection
        .doc(roomId)
        .get()
        .then(function (snap) {
        data = snap.data();
        res.json(data);
    });
});
//endpoint para cambiar player 1
app.post("/change-data-player1/:rtdbRoomId", function (req, res) {
    var rtdbRoomId = req.params.rtdbRoomId;
    var playersRef1 = db_2.rtdb.ref("/rooms/" + rtdbRoomId + "/players/0");
    playersRef1.update(req.body, function (err) {
        console.log(err);
        res.json("player1 cambio start:true");
    });
});
//endpoint para cambiar player 2
app.post("/change-data-player2/:rtdbRoomId", function (req, res) {
    var rtdbRoomId = req.params.rtdbRoomId;
    var playersRef2 = db_2.rtdb.ref("/rooms/" + rtdbRoomId + "/players/1");
    playersRef2.update(req.body, function (err) {
        console.log(err);
        res.json("player2 cambio start:true");
    });
});
var rutaRelativa = path.resolve(__dirname, "../dist/index.html");
app.get("*", function (req, res) {
    res.sendFile(rutaRelativa);
});
app.listen(port, function () {
    console.log("example listening at http://localhost:".concat(port));
});
