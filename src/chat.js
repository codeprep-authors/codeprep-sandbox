"use strict";

let connections = [];
let id = 0;

function send(ws, data) {
  ws.send(JSON.stringify(data));
}

function handleChat(ws, request) {
  ws.id = ++id;
  console.log("connect", connections.length);
  connections.push(ws);
  send(ws, {
    name: "CODEPREP",
    message: "Hi!, there are " + connections.length + " users in this room."
  });
  ws.on("message", msg => {
    try {
      const data = JSON.parse(msg);
      if (data && data.name && data.message) {
        connections.forEach(v => send(v, data));
      }
    } catch (e) {
      console.log(e);
    }
  });
  ws.on("close", () => {
    console.log("before close", connections.length, ws.id);
    connections = connections.filter(v => v.id !== ws.id);
    console.log("close", connections.length);
  });
}

module.exports = handleChat;
