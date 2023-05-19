import React from "react";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../../components/dashboard/Sidebar";
import Chart from "../../components/dashboard/Chart";
import noimage from "../../imgs/noimage.svg";
import {
  createUser,
  getStatsOrdersIncomeFromUserPastMonths,
  getUser,
  updateUser,
} from "../../apiCalls";
import { useLocation } from "react-router-dom";
import { convertChartData, emptyChartData } from "../../utils";

const Container = styled.div`
  font-family: "Nunito", sans-serif;
  display: flex;
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 40px;

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
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
`;

const InputSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
`;

const Input = styled.div`
  margin: 20px;
  width: max(calc(50% - 40px), 360px);

  input,
  select {
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
    margin-bottom: 15px;
  }

  .item {
    display: flex;
    gap: 30px;
    padding: 10px;

    .itemImg {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      padding-top: 8px;
    }

    .details {
      .itemTitle {
        margin-bottom: 10px;
        color: #555;
        font-size: 20px;
      }

      .detailItem {
        margin-bottom: 10px;
        font-size: 15px;

        .itemKey {
          font-weight: bold;
          color: gray;
          margin-right: 5px;
        }

        .itemValue {
          font-weight: 300;
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

const UserCVE = ({ mode }) => {
  const [file, setFile] = useState("");
  const defaultFields = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  };
  const [newData, setNewData] = useState(defaultFields);
  const [imageSrc, setImageSrc] = useState(noimage);
  const [msg, setMsg] = useState(" ");
  const [isClickDisabled, setIsClickDisabled] = useState(false);
  const [chartData, setChartData] = useState({
    data: [...emptyChartData],
    title: "Gastos do Usuário (Últimos 6 meses)",
    height: 300,
  });

  const [viewMode, setViewMode] = useState("");
  const [currentData, setCurrentData] = useState({});
  const location = useLocation();

  let interval;
  function showMessage(message) {
    clearInterval(interval);
    setMsg(message);
    interval = setInterval(() => {
      setMsg("");
      clearInterval(interval);
    }, 5000);
  }

  function translateRole(role) {
    switch (role) {
      case "admin":
        return "Administrador";
      case "client":
        return "Cliente";
      case "manager":
        return "Gerente";
      default:
        return role;
    }
  }

  useEffect(() => {
    if (mode === "view") {
      const id = location.pathname.split("/")[3];
      getUser(id)
        .then((res) => {
          res.ptBR_role = translateRole(res.role);
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
      getStatsOrdersIncomeFromUserPastMonths(id, 6)
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
      setImageSrc(currentData.image || noimage);
      document.getElementById("firstname").value = currentData.firstname;
      document.getElementById("lastname").value = currentData.lastname;
      document.getElementById("email").value = currentData.email;
      document.getElementById("password").value = "00000000";
      document.getElementById("role").value = currentData.role;
      setNewData(defaultFields);
    }
  }, [viewMode]);

  const createBtnClick = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("img", file);
    try {
      Object.keys(newData).map((key) => {
        let value = newData[key];
        if (value == null || value === "") {
          showMessage("Todos os campos devem ser preenchidos.");
          throw new Error();
        }
        formData.append(key, value);
      });
    } catch (err) {
      return;
    }

    setIsClickDisabled(true);
    createUser(formData)
      .then((res) => {
        showMessage("Usuário criado com sucesso.");
        document.forms[0].reset();
        document.getElementById("role").options.selectedIndex = 0;
        setImageSrc(noimage);
        setNewData(defaultFields);
        setIsClickDisabled(false);
      })
      .catch((err) => {
        showMessage("Erro ao criar usuário.");
        setIsClickDisabled(false);
      });
  };

  const editBtnClick = (e) => {
    e.preventDefault();

    let hasChange = false;
    const formData = new FormData();
    if (file) {
      formData.append("img", file);
      hasChange = true;
    }
    Object.keys(newData).forEach((key) => {
      let value = newData[key];
      if (value != null && value !== "") {
        formData.append(key, value);
        hasChange = true;
      }
    });

    if (!hasChange) {
      showMessage("É preciso haver alguma atualização nos dados.");
      return;
    }

    setIsClickDisabled(true);
    updateUser(currentData.id, formData)
      .then((res) => {
        res.ptBR_role = translateRole(res.role);
        setCurrentData(res);
        showMessage("Usuário editado com sucesso.");
        setViewMode("view");
        setIsClickDisabled(false);
      })
      .catch((err) => {
        showMessage("Erro ao editar Usuário.");
        setIsClickDisabled(false);
      });
  };

  const inputChange = (e) => {
    const inputId = e.target.id;
    const inputValue = e.target.value;
    setNewData({ ...newData, [inputId]: inputValue });
  };

  const fileInputChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    setImageSrc(URL.createObjectURL(e.target.files[0]));
    document.getElementById("file").value = "";
  };

  const removeImgBtnClick = (e) => {
    e.preventDefault();
    if (currentData?.image && !newData?.removeimg) {
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

  return (
    <Container>
      <Sidebar />
      <MainArea>
        {(viewMode === "create" || viewMode === "edit") && (
          <form className="widget">
            <Widget>
              {viewMode === "create" && <Title>Cadastrar novo Usuário</Title>}
              {viewMode === "edit" && <Title>Editar Usuário</Title>}
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
                  <label htmlFor="firstname">Nome:</label>
                  <input
                    id="firstname"
                    type="text"
                    placeholder=""
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
                <Input>
                  <label htmlFor="lastname">Sobrenome:</label>
                  <input
                    id="lastname"
                    type="text"
                    placeholder=""
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
                <Input>
                  <label htmlFor="email">E-mail:</label>
                  <input
                    id="email"
                    type="mail"
                    placeholder=""
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
                <Input>
                  <label htmlFor="password">Senha:</label>
                  <input
                    id="password"
                    type="password"
                    placeholder=""
                    onChange={inputChange}
                    disabled={isClickDisabled}
                  />
                </Input>
                <Input>
                  <label htmlFor="role">Papel:</label>
                  <select
                    id="role"
                    type="text"
                    onChange={inputChange}
                    disabled={isClickDisabled}
                    defaultValue=""
                  >
                    <option hidden disabled value=""></option>
                    <option value="admin">Administrador do sistema</option>
                    <option value="manager">Gerente</option>
                    <option value="client">Cliente</option>
                  </select>
                </Input>
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
            <h1 className="title">Dados do Usuário</h1>
            <div className="item">
              <img
                src={currentData.image || "/img/avatar_noimage.svg"}
                alt="avatar"
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{`${currentData.firstname} ${currentData.lastname}`}</h1>
                <div className="detailItem">
                  <span className="itemKey">E-mail:</span>
                  <span className="itemValue">{currentData.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Papel:</span>
                  <span className="itemValue">{currentData.ptBR_role}</span>
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

export default UserCVE;
