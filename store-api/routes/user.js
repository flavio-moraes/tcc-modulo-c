const router = require("express").Router();
const User = require("../models/User");
const {
  requireAdminAuth,
  requireSelfOrAdminAuth,
  requireAdminOrManagerAuth,
} = require("../authCheck");
const multer = require("multer");
const uploader = multer({ dest: process.env.IMG_UPLOAD_URL });
const fs = require("fs");

router.post("/", requireAdminAuth, uploader.single("img"), (req, res, err) => {
  if (req.file && req.file.fieldname === "img") {
    let fileType = req.file.mimetype.split("/")[1];
    let filePath = req.file.destination + req.file.filename;
    fs.rename(filePath, filePath + "." + fileType, async (err) => {
      if (err) throw err;
      req.body.image = req.file.filename + "." + fileType;

      User.fCreate(req.body)
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((error) => {
          fs.unlink(filePath + "." + fileType, (err) => {
            if (err) return;
          });
          let msg = error.haveMsg ? error.message : "Erro.";
          res.status(500).json({ msg: msg, message: error?.message });
        });
    });
  } else {
    User.fCreate(req.body)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
  }
});

router.put("/cart/:id?", requireSelfOrAdminAuth, (req, res) => {
  let id;
  if (req.params.id) {
    id = req.params.id;
  } else if (req.user) {
    id = req.user.id;
  } else {
    let msg = error.haveMsg ? error.message : "Erro.";
    return res.status(401).json({ msg: msg, message: error?.message });
  }
  User.fCartUpdate(id, req.body)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.put(
  "/:id",
  requireSelfOrAdminAuth,
  uploader.single("img"),
  (req, res, err) => {
    const lite = req.user.id === req.params.id;
    if (req.body.address) req.body.address = JSON.parse(req.body.address);

    const deleteFile = (fileNameWithPath) => {
      fs.unlink(fileNameWithPath, (err) => {
        if (err) return;
      });
    };

    if (req.file && req.file.fieldname === "img") {
      let fileType = req.file.mimetype.split("/")[1];
      let filePath = req.file.destination + req.file.filename;
      fs.rename(filePath, filePath + "." + fileType, async (err) => {
        if (err) throw err;
        req.body.image = req.file.filename + "." + fileType;

        User.fUpdate(req.params.id, req.body, lite)
          .then((response) => {
            if (req.body?.removeimg)
              deleteFile(process.env.IMG_UPLOAD_URL + req.body.removeimg);
            res.status(201).json(response);
          })
          .catch((error) => {
            deleteFile(filePath + "." + fileType);
            let msg = error.haveMsg ? error.message : "Erro.";
            res.status(500).json({ msg: msg, message: error?.message });
          });
      });
    } else {
      User.fUpdate(req.params.id, req.body, lite)
        .then((response) => {
          if (req.body?.removeimg)
            deleteFile(process.env.IMG_UPLOAD_URL + req.body.removeimg);
          res.status(201).json(response);
        })
        .catch((error) => {
          let msg = error.haveMsg ? error.message : "Erro.";
          res.status(500).json({ msg: msg, message: error?.message });
        });
    }
  }
);

router.delete("/:id", requireAdminAuth, (req, res) => {
  User.fDelete(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/stats", requireAdminOrManagerAuth, async (req, res) => {
  let n = req.query.months ? parseInt(req.query.months) : 0;

  User.fGetStats(n)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/:id", requireSelfOrAdminAuth, (req, res) => {
  User.fGet(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/", requireAdminAuth, (req, res) => {
  User.fGetAll()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.post("/:id/favorites/:pid", requireSelfOrAdminAuth, (req, res) => {
  User.fAddFavorite(req.params.id, req.params.pid)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.delete("/:id/favorites/:pid", requireSelfOrAdminAuth, (req, res) => {
  User.fRemoveFavorite(req.params.id, req.params.pid)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

module.exports = router;
