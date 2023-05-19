import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../../components/dashboard/Sidebar";
import { getOrder, updateOrder } from "../../apiCalls";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Container = styled.div`
  font-family: "Nunito", sans-serif;
  display: flex;
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 40px;
  padding-bottom: 40px;

  .widget {
    margin: 40px 40px 0px 40px;
    align-self: center;
  }
`;

const Widget = styled.div`
  width: 800px;
  height: fit-content;
  -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
  box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);
  padding: 10px;
  color: gray;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const InputSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;

  input,
  select,
  textarea {
    padding: 5px;
    width: calc(100% - 10px);
    border: none;
    border-bottom: 1px solid gray;
    font-family: "Nunito", sans-serif;
    color: gray;
    font-size: 15px;

    &:focus {
      outline: none;
    }
  }

  textarea {
    resize: none;
    font-size: 15px;
  }

  .withBorder {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    position: relative;
  }

  .fieldsetLabel {
    background-color: #fff;
    padding: 0px 5px 0px 5px;
    display: inline;
    position: absolute;
    top: -13px;
    font-size: 16px;
  }

  .invalid {
    border-color: red;
  }
`;

const Input = styled.div`
  margin: 20px;
  width: max(calc(50% - 40px), 360px);
`;

const InputLarge = styled.div`
  margin: 20px;
  width: max(calc(100% - 40px), 720px);
`;

const ButtonSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 30px 20px 30px 20px;
  gap: 40px;
`;

const Button = styled.button`
  font-family: "Nunito", sans-serif;
  background-color: white;
  box-sizing: content-box;
  width: 200px;
  padding: 10px;
  cursor: pointer;
  border: 2px solid #7451f8;
  border-radius: 15px;
  font-weight: 700;
  align-self: center;
  text-align: center;
  color: #7451f8;
  font-size: 14px;

  transition: all 0.3s ease;

  &:disabled {
    background-color: #ddd;
    cursor: wait;
  }
`;

const InfoWidget = styled.div`
  width: 500px;
  height: fit-content;
  -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
  box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);
  padding: 10px;
  color: gray;
  position: relative;
  margin: 40px 40px 0px 40px;
  align-self: center;

  .editButton {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px 8px 6px 8px;
    font-size: 14px;
    color: #7451f8;
    background-color: #7551f818;
    cursor: pointer;
    border-radius: 0px 0px 0px 5px;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .product {
    display: flex;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
    font-size: 15px;
    font-weight: 300;

    :nth-child(1) {
      border-top: 1px solid #ddd;
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

  .item {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 10px;

    .itemImg {
      width: 200px;
      height: 200px;
      border-radius: 15px;
      object-fit: cover;
      align-self: center;
    }

    .details {
      .itemTitle {
        margin-bottom: 20px;
        color: #555;
        font-size: 20px;
      }

      .detailItem {
        margin-bottom: 5px;
        font-size: 15px;

        &.mb {
          margin-bottom: 20px;
        }

        .itemKey {
          font-weight: bold;
          color: gray;
          margin-right: 5px;
        }

        .itemValue {
          font-weight: 300;
        }

        .itemDescValue {
          font-weight: 300;
          white-space: pre-wrap;
        }

        .itemVarContainer {
          display: flex;
          flex-direction: column;
          gap: 5px;

          .itemVarRow {
            display: flex;
            gap: 5px;

            .itemVarValue {
              flex: 1 1 0;
              font-weight: 300;
            }

            :nth-child(even) {
              background-color: hsl(253, 0%, 97%);
              .vInput {
                background-color: hsl(253, 0%, 97%);
              }
            }
          }
        }

        .itemCatContainer {
          display: flex;
          flex-wrap: wrap;
        }

        .itemCatValue {
          display: block;
          font-weight: 300;
          padding: 6px;
          margin: 3px;
          background-color: #eee;
          border-radius: 10px;
        }

        .itemInRows {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
`;

const OrderCVE = ({ mode }) => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState("");
  const [newData, setNewData] = useState({ name: "", description: "" });
  const [currentData, setCurrentData] = useState({});
  const [isClickDisabled, setIsClickDisabled] = useState(false);

  function removeRequiredClass() {
    document.querySelectorAll("[name]").forEach((el) => {
      el.classList.remove("invalid");
    });
  }

  useEffect(() => {
    if (mode === "view") {
      const id = location.pathname.split("/")[3];
      getOrder(id)
        .then((res) => {
          setCurrentData(res);
          const queryParams = new URLSearchParams(location.search);
          const value = queryParams.get("q");
          if (value === "edit") setViewMode("edit");
          else setViewMode("view");
        })
        .catch((err) => {
          setViewMode("error");
          toast.error(err.msg);
        });
    }
  }, []);

  useEffect(() => {
    if (viewMode === "edit") {
      setNewData({ ...currentData.address });
    }
  }, [viewMode]);

  const inputChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const editBtnClick = (e) => {
    e.preventDefault();

    removeRequiredClass();
    let invalidFlag = false;
    let hasChange = false;
    Object.keys(newData).forEach((key) => {
      let value = newData[key];
      if (value != null && value !== "") {
        if (value !== currentData.address[key]) {
          hasChange = true;
        }
      } else {
        invalidFlag = true;
        document.querySelector(`[name=${key}]`).classList.add("invalid");
      }
    });

    if (invalidFlag) {
      toast.error("Os campos destacados devem ser preenchidos.");
      return;
    }

    if (!hasChange) {
      toast.error("É preciso haver alguma atualização nos dados.");
      return;
    }

    setIsClickDisabled(true);
    updateOrder(currentData.id, { address: newData })
      .then((res) => {
        setCurrentData(res);
        toast("Pedido editado com sucesso.");
        setViewMode("view");
        setIsClickDisabled(false);
      })
      .catch((err) => {
        toast.error("Erro ao editar Pedido.");
        setIsClickDisabled(false);
      });
  };

  const cancelBtnClick = (e) => {
    e.preventDefault();
    setViewMode("view");
  };

  const statusMap = {
    approved: "Aprovado",
    pending: "Pendente",
    canceled: "Cancelado",
  };

  const cardIssuerMap = {
    master: "MasterCard",
    visa: "Visa",
    amex: "American Express",
  };

  return (
    <Container>
      <Sidebar />
      <MainArea>
        {viewMode === "edit" && (
          <form className="widget">
            <Widget>
              {viewMode === "edit" && <Title>Editar Pedido</Title>}

              <InputSection>
                <Input>
                  <label htmlFor="streetName">Rua:</label>
                  <input
                    type="text"
                    name="streetName"
                    value={newData.streetName}
                    placeholder="Nome da rua"
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
                <Input>
                  <label htmlFor="streetNumber">Número:</label>
                  <input
                    type="text"
                    name="streetNumber"
                    value={newData.streetNumber}
                    placeholder="Nº do imóvel"
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
                <Input>
                  <label htmlFor="cityName">Cidade:</label>
                  <input
                    type="text"
                    name="cityName"
                    value={newData.cityName}
                    placeholder="Nome da cidade"
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
                <Input>
                  <label htmlFor="stateName">Estado:</label>
                  <input
                    type="text"
                    name="stateName"
                    value={newData.stateName}
                    placeholder="Sigla do Estado"
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
                <Input>
                  <label htmlFor="zipCode">CEP:</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={newData.zipCode}
                    placeholder="CEP"
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
              </InputSection>

              <ButtonSection>
                {viewMode === "edit" && (
                  <>
                    <Button onClick={editBtnClick} disabled={isClickDisabled}>
                      CONFIRMAR
                    </Button>
                    <Button onClick={cancelBtnClick} disabled={isClickDisabled}>
                      CANCELAR
                    </Button>
                  </>
                )}
              </ButtonSection>
            </Widget>
          </form>
        )}
        {viewMode === "view" && (
          <InfoWidget>
            <div className="editButton" onClick={(e) => setViewMode("edit")}>
              Editar
            </div>
            <h1 className="title">Dados do Pedido</h1>
            <div className="item">
              <div className="details">
                <h1 className="itemTitle">
                  Pedido nº: {currentData.transactionId}
                </h1>

                <div className="detailItem">
                  <span className="itemKey">Data:</span>
                  <span className="itemValue">
                    {new Date(currentData.createdAt).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Valor total:</span>
                  <span className="itemValue">
                    {currentData.amount
                      .toFixed(2)
                      .replace(".", ",")
                      .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Status:</span>
                  <span className="itemValue">
                    {statusMap[currentData.status]}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Comprador:</span>
                  <span className="itemValue">{currentData.userName}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Pagamento:</span>
                  <span className="itemValue">
                    {cardIssuerMap[currentData.payment.cardIssuer]} final:{" "}
                    {currentData.payment.cardLastFourDigits}
                  </span>
                </div>

                <div className="detailItem mb">
                  <span className="itemKey">Parcelamento:</span>
                  <span className="itemValue">
                    {currentData.payment.installments} x{" "}
                    {currentData.payment.installmentValue}
                  </span>
                </div>

                <div className="detailItem mb">
                  <div className="itemKey">Endereço de entrega:</div>
                  <div className="itemValue">
                    {currentData.address.streetName}, nº{" "}
                    {currentData.address.streetNumber}
                  </div>
                  <div className="itemValue">
                    {currentData.address.cityName} -{" "}
                    {currentData.address.stateName}
                  </div>
                  <div className="itemValue">{currentData.address.zipCode}</div>
                </div>

                <div className="detailItem">
                  <div className="itemKey" style={{ marginBottom: "5px" }}>
                    Produtos do pedido:
                  </div>
                  <div className="itemInRows">
                    {currentData.products.map((entry, i) => {
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
                  </div>
                </div>
              </div>
            </div>
          </InfoWidget>
        )}
        {viewMode === "error" && (
          <h1>Ocorreu um erro ao processar a requisição.</h1>
        )}
      </MainArea>
    </Container>
  );
};

export default OrderCVE;
