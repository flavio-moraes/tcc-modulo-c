import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOrdersFromUser } from "../apiCalls";

const Container = styled.div``;

const Wrapper = styled.div`
  box-sizing: border-box;
  min-height: calc(100vh - 330px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 30px 0px 60px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;

  .middle {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

const SubContainer = styled.div`
  flex: 1;
  min-width: 400px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrdersContainer = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Order = styled.div`
  flex: 1;
  box-sizing: border-box;
  box-shadow: 4px 4px 7px 1px rgba(41, 41, 41, 0.25);
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 500px;
  height: fit-content;
  padding: 20px;
  gap: 5px;
  position: relative;

  span:first-child {
    margin-bottom: 10px;
    font-size: 18px;
  }

  .status {
    position: absolute;
    top: 10px;
    right: 10px;

    &.approved {
      color: green;
    }
  }

  .product {
    display: flex;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;

    :nth-of-type(1) {
      border-top: 1px solid #ddd;
      margin-top: 20px;
    }

    :last-of-type {
      margin-bottom: 20px;
    }

    h3 {
      font-size: 16px;
    }

    img {
      box-sizing: border-box;
      height: 50px;
      width: 50px;
      object-fit: cover;
    }

    .nameArea {
      flex: 1;
      box-sizing: border-box;
      margin-left: 5px;
      padding: 0px 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .priceArea {
      display: flex;
      box-sizing: border-box;
      padding: 0px 10px;
      flex-direction: column;
      gap: 5px;
      text-align: right;
    }

    .infoItem {
    }
  }
`;

const Spinner = styled.div`
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #aaa;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;

  align-self: center;

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Title = styled.h1``;

const OrderList = () => {
  const [orderList, setOrderList] = useState([]);
  const user = useSelector((state) => state.user.info);
  const [phase, setPhase] = useState("fetching");

  const cardIssuerMap = {
    master: "MasterCard",
    visa: "Visa",
    amex: "American Express",
  };

  const statusMap = {
    approved: "Aprovado",
    pending: "Pendente",
    canceled: "Cancelado",
  };

  useEffect(() => {
    getOrdersFromUser(user.id)
      .then((res) => {
        setOrderList(res);
        if (res.length > 0) setPhase("done");
        else setPhase("empty");
      })
      .catch((err) => {
        setPhase("empty");
      });
  }, []);

  return (
    <Container>
      <Navbar />
      <Wrapper>
        {phase === "fetching" ? (
          <SubContainer className="middle">
            <Spinner data-testid="spinner" />
          </SubContainer>
        ) : phase === "empty" ? (
          <SubContainer className="middle">
            <Title>Nenhum pedido foi encontrado!</Title>
            <p>Navegue pelos produtos do site e realize pedidos de compra.</p>
          </SubContainer>
        ) : (
          <SubContainer>
            <Title>Meus Pedidos</Title>
            <OrdersContainer>
              {orderList.map((order, i) => {
                return (
                  <Order key={order.id}>
                    <span>
                      <strong>Pedido:</strong> {order.transactionId}
                    </span>
                    <span>
                      <strong>Data:</strong>{" "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span>
                      <strong>Valor total:</strong>{" "}
                      {order.amount
                        .toFixed(2)
                        .replace(".", ",")
                        .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
                    </span>
                    <span>
                      <strong>Pagamento:</strong>{" "}
                      {cardIssuerMap[order.payment.cardIssuer]} final:{" "}
                      {order.payment.cardLastFourDigits}
                    </span>
                    <span>
                      <strong>Parcelamento:</strong>{" "}
                      {order.payment.installments} x{" "}
                      {order.payment.installmentValue}
                    </span>

                    {order.products.map((entry, i) => {
                      return (
                        <div key={entry.variantId} className="product">
                          <img src={entry.productImage || "/img/noimage.svg"} />
                          <div className="nameArea">
                            <h3>{entry.productName}</h3>
                            <span className="infoItem">
                              Variante: {entry.variantName}
                            </span>
                          </div>
                          <div className="priceArea">
                            <span className="infoItem">
                              QTD.: {entry.quantity}
                            </span>
                            <span className="infoItem">
                              R${" "}
                              {(entry.quantity * entry.variantPrice)
                                .toFixed(2)
                                .replace(".", ",")
                                .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <span>
                      <strong>Endereço de entrega:</strong>
                    </span>
                    <span>
                      {order.address.streetName}, nº{" "}
                      {order.address.streetNumber}
                    </span>
                    <span>
                      {order.address.cityName} - {order.address.stateName}
                    </span>
                    <span>{order.address.zipCode}</span>

                    <span className={`status ${order.status}`}>
                      {statusMap[order.status]}
                    </span>
                  </Order>
                );
              })}
            </OrdersContainer>
          </SubContainer>
        )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default OrderList;
