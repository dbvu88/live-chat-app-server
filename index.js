require("dotenv").config();
const app = require("express")();
const cors = require("cors");

app.use(cors);

// app.get("/", (req, res) => {
//   res.send("<h1>hello</h1>");
// });

const http = require("http").createServer(app);
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

const port = process.env.PORT || 8000;

http.listen(port);

// http.listen(port);
console.log("listen on port", port);
