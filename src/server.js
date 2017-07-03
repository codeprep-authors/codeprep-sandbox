"use strict";

const express   = require("express");
const expressWs = require("express-ws");
const chat      = require("./chat");

class Server {
  constructor() {
    this.app = expressWs(express()).app;
    this.configure();
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  }

  configure() {
    this.app.use(express.static("public"));
    this.app.ws("/api/websocket/chat", chat);
  }
}

module.exports = Server;