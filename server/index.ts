import ws from "ws";
const { Server } = ws;
import { v4 as setId } from "uuid";

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const wss = new Server({ port: +PORT });

const clients: { [key: string]: ws.WebSocket } = {};
const TIME_RELOAD = 10;

let startTime = new Date();
let reloadTime = new Date();
console.log(
  reloadTime.toLocaleString("en-US", {
    timeZone: "Europe/Moscow",
  })
);
const start = async () => {
  let curID = "";
  wss.on("connection", (ws) => {
    const id = setId();
    if (Object.keys(clients).length === 0) curID = id;
    clients[id] = ws;
    ws.send(
      JSON.stringify({
        status: "start",
        me: id,
        startTime: startTime.toLocaleString("en-US", {
          timeZone: "Europe/Moscow",
        }),
        reloadTime: reloadTime.toLocaleString("en-US", {
          timeZone: "Europe/Moscow",
        }),
        curClient: curID,
        clients: Object.keys(clients),
        timeValue: TIME_RELOAD,
      })
    );
    for (const idOfClient in clients)
      if (idOfClient !== id)
        clients[idOfClient].send(
          JSON.stringify({
            status: "reload",
            startTime: startTime.toLocaleString("en-US", {
              timeZone: "Europe/Moscow",
            }),
            reloadTime: reloadTime.toLocaleString("en-US", {
              timeZone: "Europe/Moscow",
            }),
            curClient: curID,
            clients: Object.keys(clients),
          })
        );
  });
  const interval = setInterval(() => {
    if (Object.keys(clients).length > 0) {
      if (new Date() > reloadTime) {
        for (const id in clients) {
          if (clients[id].readyState === clients[id].CLOSED) {
            delete clients[id];
          }
        }

        let curClientInd = Object.keys(clients).findIndex((id) => id === curID);
        if (curClientInd !== -1) curID = Object.keys(clients)[curClientInd + 1];

        if (clients[curID] === undefined) curID = Object.keys(clients)[0];

        startTime = new Date();
        reloadTime = new Date(
          startTime.setSeconds(startTime.getSeconds() + TIME_RELOAD)
        );

        console.log(
          reloadTime.toLocaleString("en-US", {
            timeZone: "Europe/Moscow",
          })
        );

        for (const id in clients)
          clients[id].send(
            JSON.stringify({
              status: "reload",
              startTime: startTime.toLocaleString("en-US", {
                timeZone: "Europe/Moscow",
              }),
              reloadTime: reloadTime.toLocaleString("en-US", {
                timeZone: "Europe/Moscow",
              }),
              curClient: curID,
              clients: Object.keys(clients),
            })
          );
      }
    } else {
      startTime = new Date();
      reloadTime = new Date();
    }
  }, 100);
};

start();
