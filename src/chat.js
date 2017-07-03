"use strict";

const WebSocket = require('ws');

// 接続中のWebSocketコネクションを保持する配列
let connections = [];

// 接続したWebSocketに割り振るシーケンスナンバー
let id = 0;

/**
 * JSのオブジェクトをJSON化してWebSocketに送信
 */
function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function handleChat(ws, request) {
  // WebSocketにidを割り振り配列に保存 
  ws.id = ++id;
  connections.push(ws);

  // 最初のメッセージを送信
  send(ws, {
    name: "CODEPREP",
    message: "Hi!, there are " + connections.length + " users in this room."
  });

  // HerokuのWebSocketタイムアウトを避けるため30秒ごとにpingメッセージを送信する
  // (pingメッセージはクライアント側では無視される)
  ws.intrervalHandle = setInterval(() => {
    send(ws, {
      ping: true
    });
  }, 30 * 1000);

  // メッセージ受信時の処理
  ws.on("message", msg => {
    try {
      // 受信データがJSON形式であり、nameとmessageが設定されている場合はブロードキャストする
      const data = JSON.parse(msg);
      if (data && data.name && data.message) {
        connections.forEach(v => send(v, data));
      }
    } catch (e) {
      console.log(e);
    }
  });

  // WebSocket切断時の処理
  ws.on("close", () => {
    // 配列からデータを削除し、インターバル処理をクリアする
    connections = connections.filter(v => v.id !== ws.id);
    clearInterval(ws.intrervalHandle);
  });
}

module.exports = handleChat;
