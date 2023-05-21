import "./App.css";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PostCheckout from "./pages/PostCheckout";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as Lnk,
  Redirect,
  BrowserRouter,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./pages/dashboard/Dashboard";
import List from "./pages/dashboard/List";
import UserCVE from "./pages/dashboard/UserCVE";
import ProductCVE from "./pages/dashboard/ProductCVE";
import { getSession, setDispatch } from "./apiCalls";
import Favorites from "./pages/Favorites";
import AccountData from "./pages/AccountData";
import OrderList from "./pages/OrderList";
import OrderCVE from "./pages/dashboard/OrderCVE";
import About from "./pages/About";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-weight: bold;
    font-size: 32px;
    margin-top: 30px;
    margin-bottom: 70px;
  }

  p:first-of-type {
    margin-top: 30px;
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

function App() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  setDispatch(dispatch);
  const user = useSelector((state) => state.user.info);

  useEffect(() => {
    getSession().then(() => setLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Container>
        <h1>Loja Virtual</h1>
        <Spinner />
        <p>Conectando-se ao servidor.</p>
        <p>Pode demorar algum tempo...</p>
      </Container>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            user?.role === "admin" || user?.role === "manager" ? (
              <Navigate to="/gerenciamento" replace />
            ) : undefined
          }
        >
          <Route index element={<Home />} />
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/registrar"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/carrinho/finalizar"
            element={user ? <Checkout /> : <Navigate to="/login" />}
          />
          <Route
            path="/carrinho/finalizado"
            element={user ? <PostCheckout /> : <Navigate to="/" replace />}
          />
          <Route
            path="/conta/favoritos"
            element={user ? <Favorites /> : <Navigate to="/login" />}
          />
          <Route
            path="/conta/dados"
            element={user ? <AccountData /> : <Navigate to="/login" />}
          />
          <Route
            path="/conta/pedidos"
            element={user ? <OrderList /> : <Navigate to="/login" />}
          />
          <Route path="/sobre" element={<About />} />
        </Route>

        <Route
          path="/gerenciamento"
          element={
            user?.role !== "admin" && user?.role !== "manager" ? (
              <Navigate to="/" replace />
            ) : undefined
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="usuarios">
            <Route index element={<List type="user" />} />
            <Route path=":userId" element={<UserCVE mode="view" />} />
            <Route path="novo" element={<UserCVE mode="create" />} />
          </Route>
          <Route path="produtos">
            <Route index element={<List type="product" />} />
            <Route path=":productId" element={<ProductCVE mode="view" />} />
            <Route path="novo" element={<ProductCVE mode="create" />} />
          </Route>
          <Route path="categorias">
            <Route index element={<List type="category" />} />
          </Route>
          <Route path="pedidos">
            <Route index element={<List type="order" />} />
            <Route path=":orderId" element={<OrderCVE mode="view" />} />
          </Route>
        </Route>

        <Route path="*" element={<p>Página não encontrada: Erro 404!</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
