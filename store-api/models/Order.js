const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        productName: { type: String },
        productImage: { type: String },
        variantId: { type: String },
        variantName: { type: String },
        variantPrice: { type: Number },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
    transactionId: { type: Number, required: true, unique: true },
    payment: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

const prepare = async function (dbEntry) {
  const outEntry = {};
  outEntry.id = dbEntry._id;
  outEntry.userId = dbEntry.userId;
  let res;
  try {
    res = await mongoose
      .model("User")
      .findById(dbEntry.userId)
      .select("firstname lastname");
    outEntry.userName = res.firstname + " " + res.lastname;
  } catch (err) {
    outEntry.userName = "";
  }
  outEntry.transactionId = dbEntry.transactionId;
  outEntry.amount = dbEntry.amount;
  outEntry.address = dbEntry.address;
  outEntry.status = dbEntry.status;
  outEntry.createdAt = dbEntry.createdAt;
  outEntry.payment = dbEntry.payment;
  outEntry.products = dbEntry.products.map((entry) => {
    if (entry.productImage) {
      entry.productImage =
        process.env.SERVER_URL + "/images/" + entry.productImage;
      return entry;
    } else {
      delete entry.productImage;
      return entry;
    }
  });
  return outEntry;
};

const Schema = OrderSchema;

Schema.statics.fCreate = async function (data) {
  try {
    if (!(typeof data === "object" && !Array.isArray(data) && data !== null)) {
      throw new Error("Parâmetro em formato errado.");
    }

    if (
      !data.userId ||
      !data.products ||
      !data.amount ||
      !data.address ||
      !data.status ||
      !data.transactionId ||
      !data.payment
    ) {
      let err = new Error("Dados faltando no registro.");
      err.haveMsg = "true";
      throw err;
    }

    data.products = data.products.map((entry) => {
      if (entry.productImage) {
        let img = entry.productImage.split("/");
        entry.productImage = img[img.length - 1];
        return entry;
      } else {
        entry.productImage = "";
        return entry;
      }
    });

    const entry = new this({
      userId: data.userId,
      transactionId: data.transactionId,
      products: data.products,
      amount: data.amount,
      address: data.address,
      status: data.status,
      payment: data.payment,
    });

    const saved = await entry.save();
    return await prepare(saved);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Este item já se encontra no cadastro.");
      error.haveMsg = true;
      throw error;
    } else throw err;
  }
};

Schema.statics.fUpdate = async function (id, data) {
  try {
    if (!(typeof data === "object" && !Array.isArray(data) && data !== null)) {
      throw new Error("Parâmetro em formato errado.");
    }

    let newData = {};
    newData.address = data.address;

    const res = await this.findByIdAndUpdate(
      id,
      { $set: newData },
      { new: true }
    ).exec();

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    return await prepare(res);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Este item já se encontra no cadastro.");
      error.haveMsg = true;
      throw error;
    } else throw err;
  }
};

Schema.statics.fDelete = async function (id) {
  try {
    const res = await this.findById(id);

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    const res2 = await res.remove();

    return await prepare(res2);
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGet = async function (id) {
  try {
    const res = await this.findById(id).exec();

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    return await prepare(res);
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetAll = async function () {
  try {
    const res = await this.find().exec();

    const asyncRes = await Promise.all(
      res.map(async (el) => {
        return await prepare(el);
      })
    );

    return asyncRes;
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetFromUser = async function (id) {
  try {
    const res = await this.find({ userId: id }).exec();

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    const asyncRes = await Promise.all(
      res.map(async (el) => {
        return await prepare(el);
      })
    );

    return asyncRes;
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetIncome = async function (n = 0) {
  try {
    if (n > 0) {
      let date = new Date();
      date.setMonth(date.getMonth() - n);

      const income = await this.aggregate([
        {
          $match: {
            createdAt: { $gte: date },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      return income;
    } else {
      const income = await this.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      return income[0];
    }
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetSales = async function (n = 0) {
  try {
    if (n > 0) {
      let date = new Date();
      date.setMonth(date.getMonth() - n);

      const sales = await this.aggregate([
        {
          $match: {
            createdAt: { $gte: date },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      return sales;
    } else {
      const count = await this.countDocuments();
      return { total: count };
    }
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetUserIncome = async function (id, n = 0) {
  try {
    if (n > 0) {
      let date = new Date();
      date.setMonth(date.getMonth() - n);

      const income = await this.aggregate([
        {
          $match: {
            userId: id,
            createdAt: { $gte: date },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      return income;
    } else {
      const income = await this.aggregate([
        {
          $match: {
            userId: id,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      return income[0];
    }
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetProductSales = async function (id, n = 0) {
  try {
    if (n > 0) {
      let date = new Date();
      date.setMonth(date.getMonth() - n);

      const sales = await this.aggregate([
        {
          $match: {
            "products.productId": id,
            createdAt: { $gte: date },
          },
        },
        { $unwind: "$products" },
        {
          $match: {
            "products.productId": id,
            createdAt: { $gte: date },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: "$products.quantity" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      return sales;
    } else {
      const sales = await this.aggregate([
        {
          $match: {
            "products.productId": id,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
          },
        },
      ]);

      return sales[0];
    }
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("Order", OrderSchema);
