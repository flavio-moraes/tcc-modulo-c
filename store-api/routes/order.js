const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const {
  requireClientAuth,
  requireSelfOrAdminAuth,
  requireAdminAuth,
  requireAdminOrManagerAuth,
} = require("../authCheck");
var mercadopago = require("mercadopago");
mercadopago.configurations.setAccessToken(process.env.MP_TOKEN);

router.post("/", requireClientAuth, (req, res, err) => {
  Product.fCheckStock(req.body.products)
    .then((productsUnq) => {
      mercadopago.payment
        .save(req.body.payment)
        .then(function (data) {
          const { status, response } = data;
          const { id, date_approved, card, transaction_amount } = response;
          const { last_four_digits, cardholder } = card;

          if (status !== 201) {
            let msg = error.haveMsg ? error.message : "Erro no pagamento.";
            return res.status(500).json({ msg: msg, message: error?.message });
          }

          Order.fCreate({
            userId: req.user.id,
            products: req.body.products,
            amount: transaction_amount,
            address: req.body.address,
            status: response.status,
            transactionId: id,
            payment: {
              approvedDate: date_approved,
              cardIssuer: response.payment_method_id,
              cardLastFourDigits: last_four_digits,
              cardholderName: cardholder.name,
              identificationType: cardholder.identification.type,
              identificationNumber: cardholder.identification.number,
              installments: response.installments,
              installmentValue: response.transaction_details.installment_amount,
            },
          })
            .then((response) => {
              Product.fDecrementStock(productsUnq)
                .then(() => {
                  res.status(201).json(response);
                })
                .catch((error) => {
                  let msg = error.haveMsg
                    ? error.message
                    : "Erro ao ciar pedido.";
                  return res
                    .status(500)
                    .json({ msg: msg, message: error?.message });
                });
            })
            .catch((error) => {
              let msg = error.haveMsg ? error.message : "Erro ao ciar pedido.";
              res.status(500).json({ msg: msg, message: error?.message });
            });
        })
        .catch(function (error) {
          let msg = error.haveMsg ? error.message : "Erro no pagamento.";
          res.status(500).json({ msg: msg, message: error?.message });
        });
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro ao ciar pedido.";
      return res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.put("/:id", requireAdminAuth, (req, res) => {
  Order.fUpdate(req.params.id, req.body)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.delete("/:id", requireAdminAuth, (req, res) => {
  Order.fDelete(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get(
  "/stats/income/user/:id",
  requireAdminOrManagerAuth,
  async (req, res) => {
    let n = req.query.months ? parseInt(req.query.months) : 0;

    Order.fGetUserIncome(req.params.id, n)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
  }
);

router.get(
  "/stats/sales/product/:id",
  requireAdminOrManagerAuth,
  async (req, res) => {
    let n = req.query.months ? parseInt(req.query.months) : 0;
    Order.fGetProductSales(req.params.id, n)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
  }
);

router.get("/stats/income", requireAdminOrManagerAuth, async (req, res) => {
  let n = req.query.months ? parseInt(req.query.months) : 0;

  Order.fGetIncome(n)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/stats/sales", requireAdminOrManagerAuth, async (req, res) => {
  let n = req.query.months ? parseInt(req.query.months) : 0;

  Order.fGetSales(n)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/:id", requireSelfOrAdminAuth, (req, res) => {
  Order.fGet(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/", requireAdminAuth, (req, res) => {
  Order.fGetAll()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/user/:id", requireSelfOrAdminAuth, (req, res) => {
  Order.fGetFromUser(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

module.exports = router;
