import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getStatsOrdersIncome,
  getStatsOrdersIncomePastMonths,
  getStatsOrdersSalesCount,
  getStatsOrdersSalesCountPastMonths,
  getStatsProductsCountPastMonths,
  getStatsUserCount,
  getStatsUserCountPastMonths,
  getStatsVisitsCountPastMonths,
} from "../../apiCalls";
import Chart from "../../components/dashboard/Chart";
import Sidebar from "../../components/dashboard/Sidebar";
import Widget from "../../components/dashboard/Widget";
import { convertChartData, emptyChartData } from "../../utils";

const Container = styled.div`
  font-family: "Nunito", sans-serif;
  display: flex;
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WidgetArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  height: fit-content;
`;

const ChartArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  height: fit-content;
`;

const TableArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  height: fit-content;
`;

const Dashboard = () => {
  const [widgetsData, setWidgetsData] = useState({
    user: {
      value: 0,
      diff: null,
    },
    order: {
      value: 0,
      diff: null,
    },
    earning: {
      value: 0,
      diff: null,
    },
  });

  const [chartsData, setChartsData] = useState({
    user: {
      data: [...emptyChartData],
      title: "Usuários Cadastrados (Últimos 6 meses)",
      height: 200,
      width: 800,
    },
    order: {
      data: [...emptyChartData],
      title: "Nº de Pedidos (Últimos 6 meses)",
      height: 200,
      width: 800,
    },
    earning: {
      data: [...emptyChartData],
      title: "Receita (Últimos 6 meses)",
      height: 200,
      width: 800,
    },
    product: {
      data: [...emptyChartData],
      title: "Produtos Cadastrados (Últimos 6 meses)",
      height: 200,
      width: 800,
    },
    visit: {
      data: [...emptyChartData],
      title: "Visitas (Últimos 6 meses)",
      height: 200,
      width: 800,
    },
  });

  useEffect(() => {
    getStatsUserCount()
      .then((res) => {
        setWidgetsData((prev) => {
          return { ...prev, user: { ...prev.user, value: res.total } };
        });
      })
      .catch((err) => {});

    getStatsOrdersSalesCount()
      .then((res) => {
        setWidgetsData((prev) => {
          return { ...prev, order: { ...prev.order, value: res.total } };
        });
      })
      .catch((err) => {});

    getStatsOrdersIncome()
      .then((res) => {
        setWidgetsData((prev) => {
          return { ...prev, earning: { ...prev.earning, value: res.total } };
        });
      })
      .catch((err) => {});

    getStatsOrdersIncomePastMonths(6)
      .then((res) => {
        const data = convertChartData(res);
        setChartsData((prev) => {
          return {
            ...prev,
            earning: {
              ...prev.earning,
              data: data,
            },
          };
        });
        if (data.at(-2).Total !== 0) {
          const diff = (data.at(-1).Total / data.at(-2).Total - 1) * 100;
          setWidgetsData((prev) => {
            return { ...prev, earning: { ...prev.earning, diff: diff } };
          });
        }
      })
      .catch((err) => {});

    getStatsOrdersSalesCountPastMonths(6)
      .then((res) => {
        const data = convertChartData(res);
        setChartsData((prev) => {
          return {
            ...prev,
            order: {
              ...prev.order,
              data: data,
            },
          };
        });
        if (data.at(-2).Total !== 0) {
          const diff = (data.at(-1).Total / data.at(-2).Total - 1) * 100;
          setWidgetsData((prev) => {
            return { ...prev, order: { ...prev.order, diff: diff } };
          });
        }
      })
      .catch((err) => {});

    getStatsUserCountPastMonths(6)
      .then((res) => {
        const data = convertChartData(res);
        setChartsData((prev) => {
          return {
            ...prev,
            user: {
              ...prev.user,
              data: data,
            },
          };
        });
        if (data.at(-2).Total !== 0) {
          const diff = (data.at(-1).Total / data.at(-2).Total - 1) * 100;
          setWidgetsData((prev) => {
            return { ...prev, user: { ...prev.user, diff: diff } };
          });
        }
      })
      .catch((err) => {});

    getStatsProductsCountPastMonths(6)
      .then((res) => {
        const data = convertChartData(res);
        setChartsData((prev) => {
          return {
            ...prev,
            product: {
              ...prev.product,
              data: data,
            },
          };
        });
      })
      .catch((err) => {});

    getStatsVisitsCountPastMonths(6)
      .then((res) => {
        const data = convertChartData(res);
        setChartsData((prev) => {
          return {
            ...prev,
            visit: {
              ...prev.visit,
              data: data,
            },
          };
        });
      })
      .catch((err) => {});
  }, []);

  return (
    <Container>
      <Sidebar />
      <MainArea>
        <WidgetArea>
          <Widget data={{ ...widgetsData.user, type: "user" }} />
          <Widget data={{ ...widgetsData.order, type: "order" }} />
          <Widget data={{ ...widgetsData.earning, type: "earning" }} />
        </WidgetArea>
        <ChartArea>
          <Chart config={{ ...chartsData.earning }} />
          <Chart config={{ ...chartsData.order }} />
          <Chart config={{ ...chartsData.user }} />
          <Chart config={{ ...chartsData.product }} />
          <Chart config={{ ...chartsData.visit }} />
        </ChartArea>
      </MainArea>
    </Container>
  );
};

export default Dashboard;
