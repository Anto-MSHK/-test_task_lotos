import ws from "ws";
const { Server } = ws;
import { v4 as setId } from "uuid";

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const wss = new Server({ port: +PORT });

const clients: { [key: string]: ws.WebSocket } = {};
const TIME_RELOAD = 120;

let startTime = new Date();
let reloadTime = new Date(
  startTime.setSeconds(startTime.getSeconds() + TIME_RELOAD)
);
console.log(
  reloadTime.toLocaleString("en-US", {
    timeZone: "Europe/Moscow",
  })
);
const start = async () => {
  let indexClient = 0;
  wss.on("connection", (ws) => {
    const id = setId();
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
        curClient: Object.keys(clients)[indexClient],
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
            curClient: Object.keys(clients)[indexClient],
            clients: Object.keys(clients),
          })
        );
  });
  let curClient: string = "";
  const interval = setInterval(() => {
    if (Object.keys(clients).length > 0) {
      if (new Date() > reloadTime) {
        indexClient++;
        if (clients[Object.keys(clients)[indexClient]] === undefined)
          if (clients[Object.keys(clients)[indexClient + 1]] === undefined)
            indexClient = 0;

        startTime = new Date();
        reloadTime = new Date(
          startTime.setSeconds(startTime.getSeconds() + TIME_RELOAD)
        );

        console.log(
          reloadTime.toLocaleString("en-US", {
            timeZone: "Europe/Moscow",
          })
        );

        curClient = Object.keys(clients)[indexClient];
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
              curClient,
              clients: Object.keys(clients),
            })
          );
      }
    }
  }, 100);
};

start();
