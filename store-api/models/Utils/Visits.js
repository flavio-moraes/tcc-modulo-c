const mongoose = require("mongoose");

const VisitsSchema = new mongoose.Schema(
  {
    datelabel: { type: String, required: true, unique: true },
    counter: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Schema = VisitsSchema;

Schema.statics.fIncrement = async function () {
  try {
    let date = new Date();
    let datelabel =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0");

    const res = await this.findOne({ datelabel: datelabel }).exec();

    if (res != null) {
      res.counter += 1;
      await res.save();
      return;
    }

    const newEntry = new this({
      datelabel: datelabel,
      counter: 1,
    });
    await newEntry.save();
    return;
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetStats = async function (n = 0) {
  try {
    if (n > 0) {
      let date = new Date();
      date.setMonth(date.getMonth() - n);

      const data = await this.aggregate([
        { $match: { createdAt: { $gte: date } } },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: "$counter" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      return data;
    } else {
      const data = await this.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$counter" },
          },
        },
      ]);

      return { total: data[0].total };
    }
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("Visits", Schema);
