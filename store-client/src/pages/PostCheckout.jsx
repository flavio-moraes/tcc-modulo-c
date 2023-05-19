import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Navigate, useLocation } from "react-router-dom";

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

  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;

  .image {
    box-sizing: border-box;
    width: 140px;
    height: 140px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .success {
    background-image: url("/img/success.png");
  }

  .failure {
    background-image: url("/img/failure.png");
  }
`;

const Title = styled.h1``;

const PostCheckout = (props) => {
  const location = useLocation();
  const state = location.state;

  if (state == null || state.success == null)
    return <Navigate to="/" replace />;

  if (state.success === true)
    return (
      <Container>
        <Navbar />
        <Wrapper>
          <SubContainer>
            <div className="image success" />
            <Title>Compra realizada com sucesso!</Title>
            <h2>Número do pedido: {state.orderNumber}</h2>
            <h3>
              Para acompanhar seu pedido, acesse menu "Pedidos" na área do
              usuário.
            </h3>
          </SubContainer>
        </Wrapper>
        <Footer />
      </Container>
    );

  if (state.success === false)
    return (
      <Container>
        <Navbar />
        <Wrapper>
          <SubContainer>
            <div className="image failure" />
            <Title>Não foi possível concluir a compra.</Title>
            <h2>Houve um problema com o pagamento do pedido.</h2>
          </SubContainer>
        </Wrapper>
        <Footer />
      </Container>
    );

  return <Navigate to="/" replace />;
};

export default PostCheckout;
