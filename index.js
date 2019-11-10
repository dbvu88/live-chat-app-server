const http = require("http").Server();
const io = require("socket.io")(http);

io.on("connect", client => {
  client.broadcast.emit("newUser", "new user connected");
  //   console.log(client);
  client.on("subscribeToTimer", interval => {
    setInterval(() => {
      client.emit("timer", new Date());
    }, interval);
  });

  client.on("newMessage", newMessage => {
    console.log(newMessage);
    io.emit("conversation", newMessage);
  });
});
const port = 8000;
http.listen(8000);
console.log("listen on port", port);
