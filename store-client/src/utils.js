import React from "react";

const MyElement = ({ isProduction }) => (
  <div>Environment: {isProduction ? "Production" : "Development"}</div>
);
const MyElementEl = React.createElement(MyElement);
export const isProduction = MyElementEl.type.name !== "MyElement";

export const convertChartData = (dataArray, pastMonths = 6) => {
  const monthsName = {
    1: "janeiro",
    2: "fevereiro",
    3: "março",
    4: "abril",
    5: "maio",
    6: "junho",
    7: "julho",
    8: "agosto",
    9: "setembro",
    10: "outubro",
    11: "novembro",
    12: "dezembro",
  };

  let data = [];
  for (let i = pastMonths; i >= 0; i--) {
    let date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let total = 0;
    for (const el of dataArray) {
      if (el._id.month == month && el._id.year == year) {
        total = el.total;
        break;
      }
    }

    data.push({
      name: monthsName[month] + "/" + year,
      Total: total,
    });
  }

  return data;
};

export const emptyChartData = [
  { name: "", Total: 0 },
  { name: "", Total: 0 },
  { name: "", Total: 0 },
  { name: "", Total: 0 },
  { name: "", Total: 0 },
  { name: "", Total: 0 },
];
