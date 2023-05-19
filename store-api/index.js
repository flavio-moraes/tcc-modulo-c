const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieSession = require("cookie-session");
const passport = require("passport");
const cors = require("cors");
var session = require("express-session");
const { Server } = require("socket.io");
const { createServer } = require("http");

dotenv.config();
const passportSetup = require("./passportSetup");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const categoryRoute = require("./routes/category");
const bodyParser = require("body-parser");

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log(`Conexão ao BD bem sucedida. ${res}`))
  .catch((err) => console.log(`Falha na conexão com o BD. ${err}`));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SEC,
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("disconnect", (reason) => {
    console.log("Socket diconnect reason: ", reason);
  });
});

app.use("/images", express.static(process.env.IMG_UPLOAD_URL));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/categories", categoryRoute);

server.listen(process.env.PORT || 5000, () => {
  console.log("Servidor Backend está rodando.");
});
