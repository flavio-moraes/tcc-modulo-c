import styled from "styled-components";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Container = styled.div`
  width: ${(props) => props.w};
  height: ${(props) => props.h};
  -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
  box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);
  padding: 10px;
  color: gray;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Chart = (props) => {
  let { children, config, ...others } = props;
  config = config || {};
  config.height = config.height ? config.height + "px" : "370px";
  config.width = config.width ? config.width + "px" : "700px";
  config.hexcolor = config.hexcolor || "#8884d8";
  const dummyData = [
    { name: "Janeiro", Total: 1200 },
    { name: "Fevereiro", Total: 2100 },
    { name: "Março", Total: 800 },
    { name: "Abril", Total: 1600 },
    { name: "Maio", Total: 900 },
    { name: "Junho", Total: 1700 },
  ];
  config.data = config.data || dummyData;

  return (
    <Container h={config.height} w={config.width} {...others}>
      {config.title && <Title>{config.title}</Title>}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={config.data}
          margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.hexcolor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={config.hexcolor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(228, 225, 225)" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke={config.hexcolor}
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default Chart;
