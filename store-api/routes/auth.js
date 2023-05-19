const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const passport = require("passport");
const { requireAuth, requireAdminOrManagerAuth } = require("../authCheck");
const Visits = require("../models/Utils/Visits");

router.post("/register", async (req, res) => {
  User.fCreate(req.body)
    .then((user) => {
      req.login(user, function (err) {
        if (err) return res.status(500).json(err);
        res.status(201).json(user);
      });
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

const visitsStat = (req, res, next) => {
  Visits.fIncrement()
    .then(() => {})
    .catch(() => {});
  return next();
};

router.get("/session", visitsStat, requireAuth, async (req, res) => {
  if (req.user) {
    User.fGetSession(req.user.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
  } else {
    res.status(401).json({ msg: "Não logado." });
  }
});

router.get("/stats/visits", requireAdminOrManagerAuth, async (req, res) => {
  let n = req.query.months ? parseInt(req.query.months) : 0;
  Visits.fGetStats(n)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.post("/local", passport.authenticate("local"), (req, res) => {
  if (req.user) {
    const { cart, ...rest } = req.user;
    res.status(200).json({ user: rest, cart: cart });
  } else {
    res.status(401).json({ msg: "Não logado." });
  }
});

const addSocketIdtoSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

router.get(
  "/google",
  addSocketIdtoSession,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  const io = req.app.get("io");
  const { cart, ...rest } = req.user;
  io.in(req.session.socketId).emit("google", { user: rest, cart: cart });
  res.status(200).json({ success: true, message: "success" });
});

router.get(
  "/github",
  addSocketIdtoSession,
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback", passport.authenticate("github"), (req, res) => {
  const io = req.app.get("io");
  const { cart, ...rest } = req.user;
  io.in(req.session.socketId).emit("github", { user: rest, cart: cart });
  res.status(200).json({ success: true, message: "success" });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
