import ws from "ws";
import { createServer } from "https";
const { Server } = ws;
import { v4 as setId } from "uuid";

require("dotenv").config();

const PORT = 5000;
const wss = new Server({ port: +PORT });

const clients: { [key: string]: ws.WebSocket } = {};
const TIME_RELOAD = 120;

let startTime = new Date();
let reloadTime = new Date();

type dataT = {
  status: "start" | "reload";
  me?: string;
  startTime: string;
  reloadTime: string;
  curClient: string;
  clients: string[];
  timeValue: number;
};

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
        startTime: startTime.toJSON(),
        reloadTime: reloadTime.toJSON(),
        curClient: curID,
        clients: Object.keys(clients),
        timeValue: TIME_RELOAD,
      } as dataT)
    );
    for (const idOfClient in clients)
      if (idOfClient !== id)
        clients[idOfClient].send(
          JSON.stringify({
            status: "reload",
            startTime: startTime.toJSON(),
            reloadTime: reloadTime.toJSON(),
            curClient: curID,
            clients: Object.keys(clients),
          } as dataT)
        );
  });

  setInterval(() => {
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

        for (const id in clients)
          clients[id].send(
            JSON.stringify({
              status: "reload",
              startTime: startTime.toJSON(),
              reloadTime: reloadTime.toJSON(),
              curClient: curID,
              clients: Object.keys(clients),
            } as dataT)
          );
      }
    } else {
      startTime = new Date();
      reloadTime = new Date();
    }
  }, 100);
};

start();
