import { useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  createCategory,
  deleteCategory,
  deleteOrder,
  deleteProduct,
  deleteUser,
  getAllCategories,
  getAllOrders,
  getAllProducts,
  getAllUsers,
} from "../../apiCalls";
import Datatable from "../../components/dashboard/Datatable";
import Sidebar from "../../components/dashboard/Sidebar";

const Container = styled.div`
  font-family: "Nunito", sans-serif;
  display: flex;
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index: 10;
`;

const Spinner = styled.div`
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #7451f8;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
  z-index: 11;

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

const TitleArea = styled.div`
  width: clamp(600px, calc(100% - 40px), 1042px);
  padding: 30px 20px 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  .title {
    font-size: 20px;
    font-weight: 500;
  }

  .addButton {
    color: green;
    font-size: 16px;
    font-weight: 400;
    border: 1px solid green;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  .inputArea {
    width: 100%;
    color: gray;
    display: flex;
    justify-content: center;

    .input {
      width: max(calc(40% - 40px), 360px);
      margin: 20px 20px 0px 20px;
      display: flex;
      flex-direction: column;
    }

    input {
      padding: 5px;
      width: calc(100% - 10px);
      border: none;
      border-bottom: 1px solid gray;
      font-family: "Nunito", sans-serif;
      font-size: 15px;
      color: gray;

      &:focus {
        outline: none;
      }
    }

    button {
      font-family: "Nunito", sans-serif;
      background-color: white;
      padding: 5px;
      margin-top: 15px;
      cursor: pointer;
      border: 1px solid green;
      border-radius: 5px;
      align-self: center;
      text-align: center;
      color: green;
      font-size: 16px;

      transition: all 0.3s ease;

      &:disabled {
        background-color: #ddd;
        cursor: wait;
      }
    }
  }

  .message {
    font-size: 16px;
    font-weight: 500;
    margin: 10px 0px 0px 0px;
    color: #7451f8;
    align-self: center;
    text-align: center;
    height: 20px;
  }
`;

const List = ({ type }) => {
  const [header, setHeader] = useState({ title: "", type: "" });
  const [data, setData] = useState([]);
  const [cols, setCols] = useState([]);
  const [exportOptions, setExportOptions] = useState({
    filename: "listagem.csv",
    columns: [],
  });
  const [selectionModel, setSelectionModel] = useState();
  const [catTitle, setCatTitle] = useState("");
  const [isClickDisabled, setIsClickDisabled] = useState(false);
  const [msg, setMsg] = useState("");
  const funcRef = useRef();
  const disableClick = useRef(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.info);

  useEffect(() => {
    setLoading(true);
    switch (type) {
      case "user":
        setHeader({ title: "Usuários", type: type });
        setCols(userColumns.concat(actionColumn));
        getAllUsers()
          .then((res) => setData(res))
          .catch((err) => {
            setData([]);
          })
          .finally(() => {
            setLoading(false);
          });
        setExportOptions({
          filename: "Usuários",
          columns: ["nameAndAvatar", "email", "role"],
        });
        break;
      case "product":
        setHeader({ title: "Produtos", type: type });
        setCols(productColumns.concat(actionColumn));
        getAllProducts()
          .then((res) => setData(res))
          .catch((err) => {
            setData([]);
          })
          .finally(() => {
            setLoading(false);
          });
        setExportOptions({
          filename: "Produtos",
          columns: ["nameAndImg", "price", "stock"],
        });
        break;
      case "category":
        setHeader({ title: "Categorias de Produto", type: type });
        setCols(categoryColumns);
        getAllCategories()
          .then((res) => setData(res))
          .catch((err) => {
            setData([]);
          })
          .finally(() => {
            setLoading(false);
          });
        setExportOptions({ filename: "Categorias", columns: ["title"] });
        break;
      case "order":
        setHeader({ title: "Pedidos", type: type });
        setCols(orderColumns.concat(actionColumn));
        getAllOrders()
          .then((res) => setData(res))
          .catch((err) => {
            setData([]);
          })
          .finally(() => {
            setLoading(false);
          });
        setExportOptions({
          filename: "Pedidos",
          columns: [
            "date",
            "transactionId",
            "userName",
            "amount",
            "quantity",
            "status",
          ],
        });
        break;
      default:
        setData([]);
    }
  }, [type]);

  let interval;
  function showMessage(message) {
    clearInterval(interval);
    setMsg(message);
    interval = setInterval(() => {
      setMsg("");
      clearInterval(interval);
    }, 5000);
  }

  const categoryColumns = [
    { field: "title", headerName: "Título", width: 870 },
    {
      field: "action",
      headerName: "Ação",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => funcRef.current(params.row.id)}
            >
              Deletar
            </div>
          </div>
        );
      },
    },
  ];

  const userColumns = [
    {
      field: "nameAndAvatar",
      headerName: "Nome",
      width: 280,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              className="cellImg"
              src={params.row.image || "/img/avatar_noimage.svg"}
              alt="avatar"
            />
            {params.row.firstname + " " + params.row.lastname}
          </div>
        );
      },
    },
    { field: "email", headerName: "E-mail", width: 280 },
    {
      field: "role",
      headerName: "Papel",
      width: 200,
      valueGetter: function (params) {
        switch (params.row.role) {
          case "admin":
            return "Administrador";
          case "client":
            return "Cliente";
          case "manager":
            return "Gerente";
          default:
            return params.row.role;
        }
      },
    },
  ];

  const productColumns = [
    {
      field: "nameAndImg",
      headerName: "Nome do produto:",
      width: 280,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              className="cellImgPr"
              src={params.row.image || "/img/noimage.svg"}
              alt="imagem"
            />
            {params.row.name}
          </div>
        );
      },
      valueGetter: (params) => params.row.name,
    },
    {
      field: "price",
      headerName: "Preço:",
      width: 280,
      valueGetter: function (params) {
        if (!params.row.variants) return null;
        const prices = params.row.variants.map((el) => {
          return el.price;
        });
        const max = Math.max(...prices);
        const min = Math.min(...prices);
        const maxFormated =
          "R$ " +
          max
            .toFixed(2)
            .replace(".", ",")
            .replace(/\d(?=(\d{3})+\,)/g, "$&.");
        const minFormated =
          "R$ " +
          min
            .toFixed(2)
            .replace(".", ",")
            .replace(/\d(?=(\d{3})+\,)/g, "$&.");
        return max === min ? maxFormated : minFormated + " ... " + maxFormated;
      },
    },
    {
      field: "stock",
      headerName: "Estoque total:",
      width: 200,
      valueGetter: function (params) {
        if (!params.row.variants) return null;
        return params.row.variants?.reduce((acc, obj) => acc + obj.stock, 0);
      },
    },
  ];

  const orderColumns = [
    {
      field: "date",
      headerName: "Data:",
      width: 100,
      valueGetter: function (params) {
        if (!params.row.createdAt) return null;
        return new Date(params.row.createdAt).toLocaleDateString("pt-BR");
      },
    },
    { field: "transactionId", headerName: "Nº do pedido:", width: 150 },
    { field: "userName", headerName: "Comprador:", width: 180 },
    {
      field: "amount",
      headerName: "Valor total:",
      width: 140,
      valueGetter: function (params) {
        return (
          "R$ " +
          params.row.amount
            ?.toFixed(2)
            .replace(".", ",")
            .replace(/\d(?=(\d{3})+\,)/g, "$&.")
        );
      },
    },
    {
      field: "quantity",
      headerName: "Qtd. de produtos:",
      width: 100,
      valueGetter: function (params) {
        return params.row.products?.reduce((acc, obj) => acc + obj.quantity, 0);
      },
    },
    {
      field: "status",
      headerName: "Status:",
      width: 160,
      renderCell: (params) => {
        let map = {
          approved: "Aprovado",
          pending: "Pendente",
          canceled: "Cancelado",
        };
        return (
          <div className={`cellWithStatus ${params.row.status}`}>
            {map[params.row.status]}
          </div>
        );
      },
      valueGetter: function (params) {
        let map = {
          approved: "Aprovado",
          pending: "Pendente",
          canceled: "Cancelado",
          undefined: "",
        };
        return map[params.row.status];
      },
    },
  ];

  const handleDelete = async (id) => {
    if (isClickDisabled) return;
    setIsClickDisabled((recentState) => true);

    try {
      let res;
      switch (type) {
        case "user":
          res = await deleteUser(id);
          break;
        case "product":
          res = await deleteProduct(id);
          break;
        case "category":
          res = await deleteCategory(id);
          break;
        case "order":
          res = await deleteOrder(id);
          break;
        default:
      }
      setData(data.filter((item) => item.id !== id));
      setIsClickDisabled(false);
    } catch (err) {
      setIsClickDisabled(false);
      return;
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Ação",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={params.row.id}>
              <div className="viewButton">Ver</div>
            </Link>
            <Link to={params.row.id + "?q=edit"}>
              <div className="editButton">Editar</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => funcRef.current(params.row.id)}
            >
              Deletar
            </div>
          </div>
        );
      },
    },
  ];

  const addCategory = (e) => {
    setIsClickDisabled(true);
    if (!catTitle) {
      showMessage("Título não pode ser vazio!");
      setIsClickDisabled(false);
      return;
    }
    createCategory({ title: catTitle })
      .then((res) => {
        if (res) setData([...data, res]);
        document.getElementById("cat_title").value = "";
        setCatTitle("");
        setIsClickDisabled(false);
      })
      .catch((err) => {
        showMessage(err.message);
        document.getElementById("cat_title").value = "";
        setCatTitle("");
        setIsClickDisabled(false);
      });
  };

  funcRef.current = handleDelete;

  const config = {
    rows: data,
    columns: cols,
    exportOptions: exportOptions,
    selectionModel: selectionModel,
    setSelectionModel: setSelectionModel,
    checkbox: false,
    clickSelection: false,
  };

  if (user.role === "manager" && (type === "user" || type === "order")) {
    return (
      <Container>
        <Sidebar />
        <MainArea>
          <TitleArea>
            <h1 className="title">
              Você não possui permissão para acessar este painel.
            </h1>
          </TitleArea>
        </MainArea>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar />
      <MainArea>
        {loading && (
          <Overlay>
            <Spinner />
          </Overlay>
        )}
        <TitleArea>
          {header.type === "category" ? (
            <>
              <h1 className="title">{header.title}</h1>
              <div className="inputArea">
                <div className="input">
                  <label htmlFor="cat_title">Título:</label>
                  <input
                    id="cat_title"
                    type="text"
                    onChange={(e) => setCatTitle(e.target.value)}
                    disabled={isClickDisabled}
                    onKeyUp={(e) => {
                      e.key === "Enter" && addCategory();
                    }}
                  />
                  <button onClick={addCategory} disabled={isClickDisabled}>
                    Adicionar categoria
                  </button>
                  <h2 className="message">{msg}</h2>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="title">{header.title}</h1>
              {header.type !== "order" && (
                <Link to="novo" className="addButton">
                  Adicionar
                </Link>
              )}
            </>
          )}
        </TitleArea>
        <Datatable config={config} />
      </MainArea>
    </Container>
  );
};

export default List;
