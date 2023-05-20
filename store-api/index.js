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
  /*   res.cookie("teste1", "teste1", {
    domain: "lojavirtual-sprint2.vercel.app",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.cookie("teste2", "teste2", {
    domain: "https://lojavirtual-sprint2.vercel.app",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.cookie("teste3", "teste3", {
    domain: "loja-virtual-modulo-c.onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.cookie("teste4", "teste4", {
    domain: "https://loja-virtual-modulo-c.onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.cookie("teste5", "teste5", {
    domain: ".lojavirtual-sprint2.vercel.app",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.cookie("teste6", "teste6", {
    domain: ".loja-virtual-modulo-c.onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  }); */
  res.cookie("teste7", "teste7", {
    domain: ".onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.cookie("teste8", "teste8", {
    domain: "onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.cookie("teste9", "teste9", {
    domain: ".onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: true,
  });
  res.cookie("teste10", "teste10", {
    domain: "onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: true,
  });
  res.cookie("teste11", "teste11", {
    domain: ".onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: false,
  });
  res.cookie("teste12", "teste12", {
    domain: "onrender.com",
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: false,
  });
  res.cookie("teste13", "teste13", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.cookie("teste14", "teste14", {
    secure: true,
    httpOnly: true,
    sameSite: true,
  });
  res.cookie("teste15", "teste15", {
    secure: true,
    httpOnly: true,
    sameSite: false,
  });
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
      sameSite: true,
      domain: process.env.DOMAIN_URL,
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
