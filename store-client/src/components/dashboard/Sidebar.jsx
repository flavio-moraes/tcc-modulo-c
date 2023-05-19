import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { logout as doLogout } from "../../apiCalls";
import { useSelector } from "react-redux";

const Container = styled.div`
  width: 240px;
  border-right: 0.5px solid rgb(230, 227, 227);
  min-height: 100vh;
  background-color: white;
  flex-shrink: 0;
`;

const Top = styled.div`
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom: 0.5px solid rgb(230, 227, 227);
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const Title = styled.div`
  font-size: 14px;
`;

const Middle = styled.div`
  padding: 10px;
`;

const SubTitle = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: #999;
  margin-top: 15px;
  margin-bottom: 5px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #ece8ff;
  }
`;

const iconStyle = { fontSize: "22px", color: "#7451f8" };

const MenuItemLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #888;
  margin-left: 10px;
`;

const Info = styled.div`
  font-size: 14px;
  color: #888;
`;

const Sidebar = () => {
  const user = useSelector((state) => state.user.info);
  const roleMap = {
    admin: "administrador",
    manager: "gerente",
  };

  return (
    <Container>
      <Top>
        <Link to="/gerenciamento">
          <Logo>Loja Virtual</Logo>
          <Title>Painel Administrativo</Title>
        </Link>
      </Top>
      <Middle>
        <SubTitle>PAINÉIS</SubTitle>

        <Link to="/gerenciamento">
          <MenuItem>
            <InsertChartIcon style={iconStyle} />
            <MenuItemLabel>Estatísticas</MenuItemLabel>
          </MenuItem>
        </Link>

        {user.role === "admin" && (
          <Link to="/gerenciamento/usuarios">
            <MenuItem>
              <PersonOutlineIcon style={iconStyle} />
              <MenuItemLabel>Usuários</MenuItemLabel>
            </MenuItem>
          </Link>
        )}

        <Link to="/gerenciamento/produtos">
          <MenuItem>
            <StoreIcon style={iconStyle} />
            <MenuItemLabel>Produtos</MenuItemLabel>
          </MenuItem>
        </Link>

        <Link to="/gerenciamento/categorias">
          <MenuItem>
            <SellOutlinedIcon style={iconStyle} />
            <MenuItemLabel>Categorias</MenuItemLabel>
          </MenuItem>
        </Link>

        {user.role === "admin" && (
          <Link to="/gerenciamento/pedidos">
            <MenuItem>
              <CreditCardIcon style={iconStyle} />
              <MenuItemLabel>Pedidos</MenuItemLabel>
            </MenuItem>
          </Link>
        )}

        <MenuItem onClick={doLogout}>
          <ExitToAppIcon style={iconStyle} />
          <MenuItemLabel>Logout</MenuItemLabel>
        </MenuItem>

        <SubTitle style={{ marginTop: "50px" }}>LOGADO COMO:</SubTitle>
        <Info>Usuário: {user.firstname}</Info>
        <Info>Papel: {roleMap[user.role]}</Info>
      </Middle>
    </Container>
  );
};

export default Sidebar;
