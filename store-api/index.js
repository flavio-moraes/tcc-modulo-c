const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieSession = require("cookie-session");
const passport = require("passport");
const cors = require("cors");
var session = require("express-session");
const MongoSessionStore = require("connect-mongo");
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

const mongoClientPromisse = mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => {
    console.log(`Conexão ao BD bem sucedida. ${res}`);
    return res.connection.getClient();
  })
  .catch((err) => console.log(`Falha na conexão com o BD. ${err}`));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.DOMAIN_URL);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.enable("trust proxy");
app.set("trust proxy", 1);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SEC,
    resave: false,
    saveUninitialized: false,
    name: "sessionId-tccstorec",
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
    store: MongoSessionStore.create({
      clientPromise: mongoClientPromisse,
      ttl: 1 * 60 * 60,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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
