const fs = require("fs");

const app = require("http")
  .createServer((req, res) => {
    const index = fs.readFileSync("./client.html", err => {
      if (err) throw err;
    });
    res.end(index);
  })
  .listen(3003, console.log("server running..."));

const io = require("socket.io")(app);

const users = [];

// 用户连接
io.on("connection", socket => {
  console.log("user connected");

  // 用户登陆
  socket.on("login", name => {
    console.log("user login " + name);
    users.push(name);
    io.emit("user change", users);
    io.emit("join", name);
  });

  // 用户发送消息
  socket.on("send", info => {
    io.emit("update message", info);
  });

  // 用户注销
  socket.on("user leave", name => {
    console.log(name + " leave");
    users.pop(name);
    io.emit("user change", users);
    io.emit("leave", name);
  });
});
