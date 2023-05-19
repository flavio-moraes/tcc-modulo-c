import React from "react";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../../components/dashboard/Sidebar";
import Chart from "../../components/dashboard/Chart";
import noimage from "../../imgs/noimage.svg";
import {
  createProduct,
  getAllCategories,
  getProduct,
  getStatsSalesCountOfProductPastMonths,
  updateProduct,
} from "../../apiCalls";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { convertChartData, emptyChartData } from "../../utils";

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

const ImgSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    background-color: #ccc;
    padding: 7px;
    border-radius: 15px;
    color: white;
    margin-top: 8px;
    cursor: pointer;
  }

  #file {
    display: none;
  }
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 15px;
  object-fit: cover;
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
  .required {
    border-bottom: 1px solid red;
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

  .inRows {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 5px;

    :nth-child(even) {
      background-color: hsl(253, 0%, 97%);
      .vInput {
        background-color: hsl(253, 0%, 97%);
      }
    }
  }

  .vLabel {
    display: block;
    width: 200px;
  }

  .vInput {
    box-sizing: border-box;
    width: 200px;
  }

  .vIcon {
    width: 38px;
    font-size: 28px;
    color: #999;
    cursor: pointer;
    padding-top: 2px;
  }

  .vButton {
    width: 160px;
    padding: 8px;
    margin-top: 20px;
    color: #999;
    border: 2px solid #999;
    font-size: 12px;
  }

  .vCatLabel {
    display: block;
    width: 650px;
    align-self: center;
  }

  .vCatButton {
    font-family: "Nunito", sans-serif;
    background-color: white;
    box-sizing: content-box;
    border-radius: 15px;
    font-weight: 700;
    align-self: center;
    text-align: center;
    width: 160px;
    padding: 8px;
    margin-top: 20px;
    color: #999;
    border: 2px solid #999;
    font-size: 12px;

    appearance: none;
    transition: all 0.3s ease;

    &:disabled {
      background-color: #ddd;
      cursor: wait;
    }

    option {
      font-size: 16px;
    }
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

const Message = styled.h1`
  font-size: 16px;
  font-weight: 500;
  margin: 0px;
  color: #7451f8;
  align-self: center;
  text-align: center;
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
        margin-bottom: 20px;
        font-size: 15px;

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
      }
    }
  }
`;

const BottomArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  height: fit-content;
`;

const ProductCVE = ({ mode }) => {
  const [file, setFile] = useState("");
  const [newData, setNewData] = useState({ name: "", description: "" });
  const [imageSrc, setImageSrc] = useState(noimage);
  const [msg, setMsg] = useState(" ");
  const [isClickDisabled, setIsClickDisabled] = useState(false);
  const [chartData, setChartData] = useState({
    data: [...emptyChartData],
    title: "Vendas do Produto (Últimos 6 meses)",
    height: 300,
  });

  const [viewMode, setViewMode] = useState("");
  const [currentData, setCurrentData] = useState({});
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [selCategories, setSelCategories] = useState([]);
  const [variants, setVariants] = useState([
    { name: "Padrão", price: 0.01, stock: 1 },
  ]);

  let interval;
  function showMessage(message) {
    clearInterval(interval);
    setMsg(message);
    interval = setInterval(() => {
      setMsg("");
      clearInterval(interval);
    }, 5000);
  }

  function removeRequiredClass() {
    document.getElementById("name").classList.remove("required");
    variants.forEach((variant, i) => {
      document.getElementById("vname" + i).classList.remove("required");
      document.getElementById("vprice" + i).classList.remove("required");
      document.getElementById("vstock" + i).classList.remove("required");
    });
  }

  function haveInvalidFields() {
    let invalidFlag = false;

    if (newData.name == null || newData.name === "") {
      invalidFlag = true;
      document.getElementById("name").classList.add("required");
    }
    variants.forEach((variant, i) => {
      if (variant.name == null || variant.name === "") {
        invalidFlag = true;
        document.getElementById("vname" + i).classList.add("required");
      }
      if (variant.price == null || variant.price === "") {
        invalidFlag = true;
        document.getElementById("vprice" + i).classList.add("required");
      }
      if (variant.stock == null || variant.stock === "") {
        invalidFlag = true;
        document.getElementById("vstock" + i).classList.add("required");
      }
    });

    return invalidFlag;
  }

  const objectsEqual = (o1, o2) =>
    typeof o1 === "object" && Object.keys(o1).length > 0
      ? Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
      : o1 === o2;

  const arraysEqual = (a1, a2) =>
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

  function isVariantsDifferent(arr1, arr2) {
    if (arr1.length !== arr2.length) return true;
    for (let i = 0; i < arr1.length; i++) {
      for (let key of Object.keys(arr1[i])) {
        if (arr2[i][key] === undefined || arr1[i][key] !== arr2[i][key])
          return true;
      }
    }
    return false;
  }

  function isCategoriesDifferent(arr1, arr2) {
    if (arr1.length !== arr2.length) return true;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].id !== arr2[i].id) return true;
    }
    return false;
  }

  useEffect(() => {
    getAllCategories()
      .then((res) => {
        res.forEach((el) => (el.selected = false));
        setCategories(res);
      })
      .catch((err) => {});

    if (mode === "view") {
      const id = location.pathname.split("/")[3];
      getProduct(id)
        .then((res) => {
          setCurrentData(res);

          const queryParams = new URLSearchParams(location.search);
          const value = queryParams.get("q");
          if (value === "edit") setViewMode("edit");
          else setViewMode("view");
        })
        .catch((err) => {
          setViewMode("error");
          setMsg(err.message);
        });
      getStatsSalesCountOfProductPastMonths(id, 6)
        .then((res) => {
          const data = convertChartData(res);
          setChartData((prev) => {
            return {
              ...prev,
              data: data,
            };
          });
        })
        .catch((err) => {});
    } else if (mode === "create") {
      setViewMode("create");
    }
  }, []);

  useEffect(() => {
    if (viewMode === "edit") {
      setFile("");
      setNewData({
        name: currentData.name,
        description: currentData.description,
      });
      setImageSrc(currentData.image || noimage);
      setSelCategories([...currentData.categories]);
      if (currentData.variants.length > 0)
        setVariants([...currentData.variants]);
      else setVariants([{ name: "Padrão", price: 0.01, stock: 1 }]);
      let cat = categories.map((entry) => {
        for (let el of currentData.categories) {
          if (entry.id === el.id) {
            entry.selected = true;
            return entry;
          }
        }
        entry.selected = false;
        return entry;
      });
      setCategories(cat);
    }
  }, [viewMode]);

  const createBtnClick = (e) => {
    e.preventDefault();

    removeRequiredClass();
    if (haveInvalidFields()) {
      showMessage("Os campos destacados devem ser preenchidos.");
      return;
    }

    const formData = new FormData();
    formData.append("img", file);
    formData.append("name", newData.name);
    formData.append("description", newData.description);
    formData.append("variants", JSON.stringify(variants));
    formData.append("categories", JSON.stringify(selCategories));

    setIsClickDisabled(true);
    createProduct(formData)
      .then((res) => {
        showMessage("Produto criado com sucesso.");
        document.forms[0].reset();
        setImageSrc(noimage);
        setNewData({ name: "", description: "" });
        setSelCategories([]);
        const cat = categories.map((el) => {
          el.selected = false;
          return el;
        });
        setCategories(cat);
        setVariants([{ name: "Padrão", price: 0.01, stock: 1 }]);
        setIsClickDisabled(false);
      })
      .catch((err) => {
        showMessage("Erro ao criar produto.");
        setIsClickDisabled(false);
      });
  };

  const editBtnClick = (e) => {
    e.preventDefault();

    removeRequiredClass();
    if (haveInvalidFields()) {
      showMessage("Os campos destacados devem ser preenchidos.");
      return;
    }

    let hasChange = false;
    const formData = new FormData();

    if (file) {
      formData.append("img", file);
      hasChange = true;
    }

    Object.keys(newData).forEach((key) => {
      let value = newData[key];
      if (value !== currentData[key]) {
        formData.append(key, value);
        hasChange = true;
      }
    });

    if (isCategoriesDifferent(selCategories, currentData.categories)) {
      formData.append("categories", JSON.stringify(selCategories));
      hasChange = true;
    }

    if (isVariantsDifferent(variants, currentData.variants)) {
      formData.append("variants", JSON.stringify(variants));
      hasChange = true;
    }

    if (!hasChange) {
      showMessage("É preciso haver alguma atualização nos dados.");
      return;
    }

    setIsClickDisabled(true);
    updateProduct(currentData.id, formData)
      .then((res) => {
        setCurrentData(res);
        showMessage("Produto editado com sucesso.");
        setViewMode("view");
        setIsClickDisabled(false);
      })
      .catch((err) => {
        showMessage("Erro ao editar Produto.");
        setIsClickDisabled(false);
      });
  };

  const inputChange = (e, field, list, i) => {
    if (list) {
      if (list === "variants") {
        let list = [...variants];
        list[i][field] = e.target.value;
        setVariants(list);
      }
    } else {
      setNewData({ ...newData, [field]: e.target.value });
    }
  };

  const fileInputChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    setImageSrc(URL.createObjectURL(e.target.files[0]));
    document.getElementById("file").value = "";
  };

  const removeImgBtnClick = (e) => {
    e.preventDefault();
    if (currentData.image && !newData.removeimg) {
      let img = currentData.image.split("/");
      img = img[img.length - 1];
      setNewData({ ...newData, removeimg: img });
    } else {
      URL.revokeObjectURL(imageSrc);
    }
    setFile("");
    setImageSrc(noimage);
  };

  const cancelBtnClick = (e) => {
    e.preventDefault();
    setViewMode("view");
  };

  const catAdd = (e) => {
    e.preventDefault();
    let i = e.target.value;

    let catList = [...categories];
    let cat = catList[i];
    catList[i].selected = true;
    setCategories(catList);

    let list = [...selCategories];
    const { selected, ...cat2 } = cat;
    list.push(cat2);
    setSelCategories(list);

    document.getElementById("categories").value = "";
  };

  const catRemove = (e, id) => {
    e.preventDefault();

    let catList = [...categories];
    let cat = catList.find((item) => item.id === id);
    cat.selected = false;
    setCategories(catList);

    let list = [...selCategories];
    let filteredList = list.filter((item) => item.id !== id);
    setSelCategories(filteredList);
  };

  const variantAdd = (e) => {
    e.preventDefault();

    let list = [...variants];
    let entry = { name: "", price: "", stock: "" };
    list.push(entry);
    setVariants(list);
  };

  const variantRemove = (e, i) => {
    e.preventDefault();

    let list = [...variants];
    list.splice(i, 1);
    setVariants(list);
  };

  return (
    <Container>
      <Sidebar />
      <MainArea>
        {(viewMode === "create" || viewMode === "edit") && (
          <form className="widget">
            <Widget>
              {viewMode === "create" && <Title>Cadastrar novo Produto</Title>}
              {viewMode === "edit" && <Title>Editar Produto</Title>}
              <ImgSection>
                <Image src={imageSrc} />
                {imageSrc === noimage ? (
                  <label htmlFor="file"> Carregar imagem </label>
                ) : (
                  <label onClick={removeImgBtnClick}> Remover imagem </label>
                )}
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={fileInputChange}
                  disabled={isClickDisabled}
                />
              </ImgSection>
              <InputSection>
                <Input>
                  <label htmlFor="name">Nome do Produto:</label>
                  <input
                    id="name"
                    type="text"
                    value={newData.name}
                    placeholder=""
                    onChange={(e) => inputChange(e, "name")}
                    disabled={isClickDisabled}
                  />
                </Input>
                <InputLarge>
                  <label htmlFor="description">Descrição:</label>
                  <textarea
                    id="description"
                    value={newData.description}
                    rows="3"
                    cols="50"
                    resize="none"
                    onChange={(e) => inputChange(e, "description")}
                    disabled={isClickDisabled}
                  ></textarea>
                </InputLarge>
                <InputLarge className="withBorder">
                  <label className="fieldsetLabel">Variantes:</label>
                  <div className="inRows">
                    <div className="row">
                      <label className="vLabel">Nome da variante:</label>
                      <label className="vLabel">Preço:</label>
                      <label className="vLabel">Qtd. em estoque:</label>
                    </div>
                    {variants.map((entry, i) => {
                      return (
                        <div key={i.toString()} className="row">
                          <input
                            className="vInput"
                            id={"vname" + i}
                            type="text"
                            value={entry.name}
                            onChange={(e) =>
                              inputChange(e, "name", "variants", i)
                            }
                            disabled={isClickDisabled}
                          />
                          <input
                            className="vInput"
                            id={"vprice" + i}
                            type="number"
                            value={entry.price}
                            onChange={(e) =>
                              inputChange(e, "price", "variants", i)
                            }
                            disabled={isClickDisabled}
                            step="0.01"
                            min="0.01"
                          />
                          <input
                            className="vInput"
                            id={"vstock" + i}
                            type="number"
                            value={entry.stock}
                            onChange={(e) =>
                              inputChange(e, "stock", "variants", i)
                            }
                            disabled={isClickDisabled}
                            step="1"
                            min="0"
                          />
                          {i !== 0 && (
                            <DeleteIcon
                              className="vIcon"
                              onClick={(e) => variantRemove(e, i)}
                            />
                          )}
                        </div>
                      );
                    })}
                    <Button
                      className="vButton"
                      onClick={variantAdd}
                      disabled={isClickDisabled}
                    >
                      ADICIONAR VARIANTE
                    </Button>
                  </div>
                </InputLarge>

                <InputLarge className="withBorder">
                  <label className="fieldsetLabel">Categorias:</label>
                  <div className="inRows">
                    {selCategories.map((entry, i) => {
                      return (
                        <div key={entry.title} className="row">
                          <label className="vCatLabel">{entry.title}</label>
                          <DeleteIcon
                            className="vIcon"
                            onClick={(e) => catRemove(e, entry.id)}
                          />
                        </div>
                      );
                    })}
                    <select
                      className="vCatButton"
                      id="categories"
                      disabled={isClickDisabled}
                      defaultValue=""
                      onChange={catAdd}
                    >
                      <option hidden disabled value="">
                        ADICIONAR CATEGORIA
                      </option>
                      {categories.map((entry, i) => {
                        if (!entry.selected)
                          return (
                            <option key={entry.title} value={i.toString()}>
                              {entry.title}
                            </option>
                          );
                      })}
                    </select>
                  </div>
                </InputLarge>
              </InputSection>

              <ButtonSection>
                {viewMode === "create" && (
                  <Button onClick={createBtnClick} disabled={isClickDisabled}>
                    CADASTRAR
                  </Button>
                )}
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
              <Message>{msg}</Message>
            </Widget>
          </form>
        )}
        {viewMode === "view" && (
          <InfoWidget>
            <div className="editButton" onClick={(e) => setViewMode("edit")}>
              Editar
            </div>
            <h1 className="title">Dados do Produto</h1>
            <div className="item">
              <img
                src={currentData.image || "/img/avatar_noimage.svg"}
                alt="imagem"
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{currentData.name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Variantes:</span>
                  <div className="itemVarContainer">
                    <div className="itemVarRow">
                      <div className="itemVarValue">Nome:</div>
                      <div className="itemVarValue">Preço:</div>
                      <div className="itemVarValue">Estoque:</div>
                    </div>
                    {currentData.variants.map((entry, i) => {
                      return (
                        <div key={i.toString()} className="itemVarRow">
                          <div className="itemVarValue">{entry.name}</div>
                          <div className="itemVarValue">
                            {entry.price
                              .toFixed(2)
                              .replace(".", ",")
                              .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
                          </div>
                          <div className="itemVarValue">{entry.stock}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Descrição:</span>
                  <p className="itemDescValue">{currentData.description}</p>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Categorias:</span>
                  <div className="itemCatContainer">
                    {currentData.categories.map((entry, i) => {
                      return (
                        <span key={i.toString()} className="itemCatValue">
                          {entry.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <Message>{msg}</Message>
          </InfoWidget>
        )}
        {(viewMode === "view" || viewMode === "edit") && (
          <>
            <Chart className="widget" config={{ ...chartData }} />
          </>
        )}
        {viewMode === "error" && <h1>{msg}</h1>}
      </MainArea>
    </Container>
  );
};

export default ProductCVE;
