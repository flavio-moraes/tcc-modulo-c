const router = require("express").Router();
const Product = require("../models/Product");
const { requireAdminOrManagerAuth } = require("../authCheck");
const multer = require("multer");
const uploader = multer({ dest: process.env.IMG_UPLOAD_URL });
const fs = require("fs");

router.post(
  "/",
  requireAdminOrManagerAuth,
  uploader.single("img"),
  (req, res, err) => {
    if (req.file && req.file.fieldname === "img") {
      let fileType = req.file.mimetype.split("/")[1];
      let filePath = req.file.destination + req.file.filename;
      fs.rename(filePath, filePath + "." + fileType, async (err) => {
        if (err) throw err;
        req.body.image = req.file.filename + "." + fileType;

        req.body.variants = JSON.parse(req.body.variants);
        req.body.categories = JSON.parse(req.body.categories);

        Product.fCreate(req.body)
          .then((response) => {
            res.status(201).json(response);
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
      req.body.variants = JSON.parse(req.body.variants);
      req.body.categories = JSON.parse(req.body.categories);

      Product.fCreate(req.body)
        .then((response) => {
          res.status(201).json(response);
        })
        .catch((error) => {
          let msg = error.haveMsg ? error.message : "Erro.";
          res.status(500).json({ msg: msg, message: error?.message });
        });
    }
  }
);

router.put(
  "/:id",
  requireAdminOrManagerAuth,
  uploader.single("img"),
  (req, res, err) => {
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

        if (req.body.variants)
          req.body.variants = JSON.parse(req.body.variants);
        if (req.body.categories)
          req.body.categories = JSON.parse(req.body.categories);

        Product.fUpdate(req.params.id, req.body)
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
      if (req.body.variants) req.body.variants = JSON.parse(req.body.variants);
      if (req.body.categories)
        req.body.categories = JSON.parse(req.body.categories);

      Product.fUpdate(req.params.id, req.body)
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

router.delete("/:id", requireAdminOrManagerAuth, (req, res) => {
  Product.fDelete(req.params.id)
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

  Product.fGetStats(n)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/:id", (req, res) => {
  Product.fGet(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/", (req, res) => {
  if (req.query.search) {
    const keywords = req.query.search.toLowerCase().replace(/ /g, "|");

    Product.fSearch(keywords)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
    return;
  }

  if (req.query.category) {
    const keywords = req.query.category.split(",");

    Product.fGetByCategory(keywords)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
    return;
  }

  if (req.query.random) {
    const n = parseInt(req.query.random);

    Product.fGetRandom(n)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
    return;
  }

  Product.fGetAll()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

module.exports = router;
