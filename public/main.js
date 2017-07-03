$(function() {
  var $log = $("#log");
  var $name = $("#name");
  var $message = $("#message");
  $("#submit").click(submit);
  var ws = new WebSocket("ws://" + location.host + "/api/websocket/chat");

  init();

  function init() {
    ws.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data && data.name && data.message) {
        handleMessage(data);
      }
    }
    var name = sessionStorage.getItem("name");
    if (name) {
      $name.val(name);
    }
  }

  function submit(e) {
    e.preventDefault();
    var name = $name.val();
    var message = $message.val();
    if (name && message) {
      ws.send(JSON.stringify({
        name: name,
        message: message
      }));
      $message.val("");
      sessionStorage.setItem("name", name);
    }
  }

  function handleMessage(data) {
    const $p = $("<p/>");
    const $name = $("<span class='name'/>");
    const $message = $("<span class='message'/>");

    $name.append(data.name);
    $message.append(data.message);
    $p.append($name).append($message);
    $log.append($p);
  }
});
