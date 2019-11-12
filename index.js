require("dotenv").config();
const app = require("express")();
const cors = require("cors");

app.use(cors);

const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connect", client => {
  if (!io.currentChatters) io.currentChatters = [];
  client.broadcast.emit("newUser", "new user connected");
  client.on("subscribeToTimer", interval => {
    setInterval(() => {
      client.emit("timer", new Date());
    }, interval);
  });

  client.on("newMessage", newMessage => {
    console.log(client.currentChatter);
    io.emit("conversation", newMessage);
  });

  client.on("NewChatter", nickname => {
    io.currentChatters.push(nickname);
    client.currentChatter = nickname;
    console.log(client.currentChatter, io.currentChatters);
  });

  client.on("disconnect", nickname => {
    if (client.currentChatter && io.currentChatters) {
      io.currentChatters = io.currentChatters.filter(chatter => {
        console.log("chatter", chatter);
        console.log("currentchatter", client.currentChatter);
        return chatter !== client.currentChatter;
      });
    }
    console.log(client.currentChatter, io.currentChatters);
  });
});

const port = process.env.PORT || 8000;

http.listen(port);

// http.listen(port);
console.log("listen on port", port);
