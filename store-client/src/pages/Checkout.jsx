import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useState } from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { clearCart, saveCartThunk } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { createOrder } from "../apiCalls.js";
import MyButton from "../components/Button";
import { toast } from "react-toastify";

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
`;

const SubContainer = styled.div`
  flex: 1;
  min-width: 400px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1``;

const SummaryBox = styled.div`
  box-sizing: border-box;
  box-shadow: 4px 4px 7px 1px rgba(41, 41, 41, 0.25);
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: 50px;

  .title {
    font-weight: 200;
    text-align: center;
    margin-bottom: 20px;
  }

  .product {
    display: flex;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;

    :nth-child(2) {
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

  .valueArea {
    align-self: center;
    display: flex;
    font-size: 16px;
    margin-top: 20px;

    .column {
      display: flex;
      flex-direction: column;
      gap: 8px;

      :nth-child(2) {
        align-items: flex-end;

        span:nth-child(4) {
          padding-left: 40px;
        }
      }
    }

    .label {
      font-weight: 700;
    }

    span:nth-child(4) {
      font-size: 18px;
      border-top: 1px solid #ddd;
      padding-top: 8px;
    }
  }
`;

const FormBox = styled.div`
  box-sizing: border-box;
  box-shadow: 4px 4px 7px 1px rgba(41, 41, 41, 0.25);
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: 50px;

  .title {
    font-weight: 200;
    text-align: center;
    margin-bottom: 20px;
  }

  #form-checkout,
  .wrapper {
    display: flex;
    flex-direction: column;
  }

  .container {
    height: 18px;
    display: inline-block;
    border: 1px solid rgb(118, 118, 118);
    border-radius: 2px;
    padding: 10px;
  }

  label {
    margin-top: 15px;
  }

  input,
  select {
    padding: 10px;
    font-size: 14px;

    :focus {
      outline: none;
    }
  }

  .sideBySide {
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;

    .sbsItem,
    .sbsItemBig,
    .sbsItemSml {
      flex: 1;
      min-width: 240px;
      display: flex;
      flex-direction: column;
    }

    .sbsItemBig {
      flex: 3;
      min-width: 300px;
    }

    .sbsItemSml {
      flex: 1;
      min-width: 100px;
    }
  }

  button {
    margin-top: 30px;
  }

  .lnk {
    color: rgb(63, 81, 181);
    cursor: pointer;
    align-self: center;
  }

  .invalid {
    border-color: red;
  }
`;

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const [disableInput, setDisableInput] = useState(false);
  const [step, setStep] = useState(0);
  const user = useSelector((state) => state.user.info);
  const [address, setAddress] = useState({
    streetName: user.address?.streetName || "",
    streetNumber: user.address?.streetNumber || "",
    cityName: user.address?.cityName || "",
    stateName: user.address?.stateName || "",
    zipCode: user.address?.zipCode || "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stateRef = useRef();
  stateRef.current = address;

  const MPscriptLoadHandler = () => {
    const mp = new window.MercadoPago(
      "TEST-667a1d27-d06e-43d7-a020-b2fb3282f38e"
    );

    const cardForm = mp.cardForm({
      amount: String(Math.round((cart.totalValue + 20) * 100) / 100),
      iframe: true,
      form: {
        id: "form-checkout",
        cardNumber: {
          id: "form-checkout__cardNumber",
          placeholder: "Número do cartão",
          style: {
            fontSize: "14px",
          },
        },
        expirationDate: {
          id: "form-checkout__expirationDate",
          placeholder: "MM/YY",
          style: {
            fontSize: "14px",
          },
        },
        securityCode: {
          id: "form-checkout__securityCode",
          placeholder: "Código de segurança",
          style: {
            fontSize: "14px",
          },
        },
        cardholderName: {
          id: "form-checkout__cardholderName",
          placeholder: "Titular do cartão",
        },
        issuer: {
          id: "form-checkout__issuer",
          placeholder: "Banco emissor",
        },
        installments: {
          id: "form-checkout__installments",
          placeholder: "Parcelas",
        },
        identificationType: {
          id: "form-checkout__identificationType",
          placeholder: "Tipo de documento",
        },
        identificationNumber: {
          id: "form-checkout__identificationNumber",
          placeholder: "Número do documento",
        },
        cardholderEmail: {
          id: "form-checkout__cardholderEmail",
          placeholder: "E-mail",
        },
      },
      callbacks: {
        onFormMounted: (error) => {
          if (error)
            return console.warn("Form Mounted handling error: ", error);
          console.log("Form mounted");
        },
        onSubmit: (event) => {
          event.preventDefault();
          setDisableInput(true);

          const {
            paymentMethodId: payment_method_id,
            issuerId: issuer_id,
            cardholderEmail: email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
          } = cardForm.getCardFormData();

          let data = {
            payment: {
              token,
              issuer_id,
              payment_method_id,
              transaction_amount: Number(amount),
              installments: Number(installments),
              description: "Descrição do produto",
              payer: {
                email,
                identification: {
                  type: identificationType,
                  number: identificationNumber,
                },
              },
            },
            address: stateRef.current,
            products: cart.items,
          };

          createOrder(data)
            .then((res) => {
              navigate("/carrinho/finalizado", {
                state: { success: true, orderNumber: res.transactionId },
                replace: true,
              });
              dispatch(clearCart());
              dispatch(saveCartThunk());
            })
            .catch((err) => {
              navigate("/carrinho/finalizado", {
                state: { success: false },
                replace: true,
              });
            });
        },
        onFetching: (resource) => {
          return;
        },
      },
    });
  };

  useEffect(() => {
    var el = document.createElement("script");
    document.body.appendChild(el);
    el.onload = MPscriptLoadHandler;
    el.src = "https://sdk.mercadopago.com/js/v2";
  }, []);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddress((state) => {
      return { ...state, [name]: value };
    });
  };

  const nextStep = (e) => {
    e.preventDefault();

    document.querySelectorAll("[name]").forEach((el) => {
      el.classList.remove("invalid");
    });

    let invalidFlag = false;
    Object.keys(address).forEach((key) => {
      let value = address[key];
      if (value == null || value === "") {
        invalidFlag = true;
        document.querySelector(`[name=${key}]`).classList.add("invalid");
      }
    });

    if (invalidFlag) {
      toast.error("Os campos destacados devem ser preenchidos.");
    } else {
      document.querySelectorAll("[name]").forEach((el) => {
        el.classList.remove("invalid");
      });
      setStep(1);
    }
  };

  if (cart.items.length < 1) return <Navigate to="/carrinho" />;

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <SubContainer style={{ flex: 3 }}>
          <Title>Finalizar Compra</Title>
          <FormBox>
            <div
              style={{ display: step === 0 ? "flex" : "none" }}
              className="wrapper"
            >
              <h2>1. Endereço de Entrega:</h2>
              <div className="sideBySide">
                <div className="sbsItemBig">
                  <label>Rua:</label>
                  <input
                    type="text"
                    disabled={disableInput}
                    name="streetName"
                    value={address.streetName}
                    onChange={handleInputChange}
                    placeholder="Nome da rua"
                  />
                </div>
                <div className="sbsItemSml">
                  <label>Número:</label>
                  <input
                    type="text"
                    disabled={disableInput}
                    name="streetNumber"
                    value={address.streetNumber}
                    onChange={handleInputChange}
                    placeholder="Nº do imóvel"
                  />
                </div>
              </div>
              <div className="sideBySide">
                <div className="sbsItemBig">
                  <label>Cidade:</label>
                  <input
                    type="text"
                    disabled={disableInput}
                    name="cityName"
                    value={address.cityName}
                    onChange={handleInputChange}
                    placeholder="Nome da cidade"
                  />
                </div>
                <div className="sbsItemSml">
                  <label>Estado:</label>
                  <input
                    type="text"
                    disabled={disableInput}
                    name="stateName"
                    value={address.stateName}
                    onChange={handleInputChange}
                    placeholder="Sigla do Estado"
                  />
                </div>
              </div>
              <label>CEP:</label>
              <input
                type="text"
                disabled={disableInput}
                name="zipCode"
                value={address.zipCode}
                onChange={handleInputChange}
                placeholder="CEP"
              />
              <MyButton onClick={nextStep} disabled={disableInput}>
                Próximo
              </MyButton>
            </div>

            <div style={{ display: step === 1 ? "block" : "none" }}>
              <h2>2. Dados de Pagamento:</h2>
              <form id="form-checkout">
                <label>Número do Cartão:</label>
                <div
                  id="form-checkout__cardNumber"
                  className="container"
                  disabled={disableInput}
                ></div>
                <div className="sideBySide">
                  <div className="sbsItem">
                    <label>Data de Expiração:</label>
                    <div
                      id="form-checkout__expirationDate"
                      className="container"
                      disabled={disableInput}
                    ></div>
                  </div>
                  <div className="sbsItem">
                    <label>Código de Segurança (CVC/CVV):</label>
                    <div
                      id="form-checkout__securityCode"
                      className="container"
                      disabled={disableInput}
                    ></div>
                  </div>
                </div>
                <label>Titular do Cartão:</label>
                <input
                  type="text"
                  id="form-checkout__cardholderName"
                  disabled={disableInput}
                />
                <div className="sideBySide">
                  <div className="sbsItem">
                    <label>Bandeira do Cartão:</label>
                    <select
                      id="form-checkout__issuer"
                      disabled={disableInput}
                    ></select>
                  </div>
                  <div className="sbsItem">
                    <label>Número de Parcelas:</label>
                    <select
                      id="form-checkout__installments"
                      disabled={disableInput}
                    ></select>
                  </div>
                </div>
                <div className="sideBySide">
                  <div className="sbsItem">
                    <label>Tipo de Documento:</label>
                    <select
                      id="form-checkout__identificationType"
                      disabled={disableInput}
                    ></select>
                  </div>
                  <div className="sbsItem">
                    <label>Número do Documento:</label>
                    <input
                      type="text"
                      id="form-checkout__identificationNumber"
                      disabled={disableInput}
                    />
                  </div>
                </div>
                <label>E-mail::</label>
                <input
                  type="email"
                  id="form-checkout__cardholderEmail"
                  disabled={disableInput}
                />
                <div className="sideBySide">
                  <div className="sbsItem" style={{ flexDirection: "row" }}>
                    <label
                      onClick={() => {
                        setStep(0);
                      }}
                      className="lnk"
                    >
                      VOLTAR
                    </label>
                  </div>
                  <div className="sbsItem">
                    <MyButton
                      type="submit"
                      id="form-checkout__submit"
                      disabled={disableInput}
                    >
                      FINALIZAR PAGAMENTO
                    </MyButton>
                  </div>
                </div>
              </form>
            </div>
          </FormBox>
        </SubContainer>

        <SubContainer style={{ flex: 2 }}>
          <SummaryBox>
            <h2 className="title">Resumo da Compra</h2>

            {cart.items.map((entry, i) => {
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
                    <span className="infoItem">QTD.: {entry.quantity}</span>
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

            <div className="valueArea">
              <div className="column">
                <span className="label">Subtotal:</span>
                <span className="label">Desconto:</span>
                <span className="label">Frete:</span>
                <span className="label">Total:</span>
              </div>
              <div className="column">
                <span>
                  R${" "}
                  {cart.totalValue
                    .toFixed(2)
                    .replace(".", ",")
                    .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
                </span>
                <span>R$ 0,00</span>
                <span>R$ 20,00</span>
                <span>
                  R${" "}
                  {(cart.totalValue + 20)
                    .toFixed(2)
                    .replace(".", ",")
                    .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
                </span>
              </div>
            </div>
          </SummaryBox>
        </SubContainer>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Checkout;
