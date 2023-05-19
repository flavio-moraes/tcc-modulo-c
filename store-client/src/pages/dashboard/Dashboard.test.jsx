import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import Dashboard from "./Dashboard";
import {
  getStatsOrdersIncome,
  getStatsOrdersIncomePastMonths,
  getStatsOrdersSalesCount,
  getStatsOrdersSalesCountPastMonths,
  getStatsProductsCountPastMonths,
  getStatsUserCount,
  getStatsUserCountPastMonths,
  getStatsVisitsCountPastMonths,
} from "../../apiCalls";

const mockStore = configureMockStore();

jest.mock("../../apiCalls", () => ({
  getStatsUserCount: jest.fn(),
  getStatsOrdersSalesCount: jest.fn(),
  getStatsOrdersIncome: jest.fn(),
  getStatsOrdersIncomePastMonths: jest.fn(),
  getStatsOrdersSalesCountPastMonths: jest.fn(),
  getStatsUserCountPastMonths: jest.fn(),
  getStatsProductsCountPastMonths: jest.fn(),
  getStatsVisitsCountPastMonths: jest.fn(),
}));

describe("Dashboard component", () => {
  let state;
  let store;
  let component;
  const initialState = {
    user: {
      info: {
        firstname: "Admin",
        lastname: "Admin",
        email: "admin@example.com",
        password: "000000",
        image: "user.jpg",
        role: "admin",
      },
    },
  };

  beforeEach(() => {
    getStatsUserCount.mockImplementation(() => {
      return Promise.resolve({ total: 100 });
    });

    getStatsOrdersSalesCount.mockImplementation(() => {
      return Promise.resolve({ total: 200 });
    });

    getStatsOrdersIncome.mockImplementation(() => {
      return Promise.resolve({ total: 300 });
    });

    getStatsOrdersIncomePastMonths.mockImplementation(() => {
      return Promise.resolve([
        { name: "Month 1", Total: 1000 },
        { name: "Month 2", Total: 1500 },
      ]);
    });

    getStatsOrdersSalesCountPastMonths.mockImplementation(() => {
      return Promise.resolve([
        { name: "Month 1", Total: 2000 },
        { name: "Month 2", Total: 2500 },
      ]);
    });

    getStatsUserCountPastMonths.mockImplementation(() => {
      return Promise.resolve([
        { name: "Month 1", Total: 500 },
        { name: "Month 2", Total: 800 },
      ]);
    });

    getStatsProductsCountPastMonths.mockImplementation(() => {
      return Promise.resolve([
        { name: "Month 1", Total: 100 },
        { name: "Month 2", Total: 200 },
      ]);
    });

    getStatsVisitsCountPastMonths.mockImplementation(() => {
      return Promise.resolve([
        { name: "Month 1", Total: 1000 },
        { name: "Month 2", Total: 1200 },
      ]);
    });
  });

  afterEach(() => {
    component.unmount();
  });

  it("renders sidebar, widgets and charts", async () => {
    state = { ...initialState };
    store = mockStore(() => state);

    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <Dashboard />
          </Router>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("200")).toBeInTheDocument();
        expect(screen.getByText("R$ 300,00")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByText("Usuários Cadastrados (Últimos 6 meses)")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Nº de Pedidos (Últimos 6 meses)")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Receita (Últimos 6 meses)")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Produtos Cadastrados (Últimos 6 meses)")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Visitas (Últimos 6 meses)")
        ).toBeInTheDocument();
      });
    });

    expect(getStatsUserCount).toHaveBeenCalled();
    expect(getStatsOrdersSalesCount).toHaveBeenCalled();
    expect(getStatsOrdersIncome).toHaveBeenCalled();
    expect(getStatsOrdersIncomePastMonths).toHaveBeenCalledWith(6);
    expect(getStatsOrdersSalesCountPastMonths).toHaveBeenCalledWith(6);
    expect(getStatsUserCountPastMonths).toHaveBeenCalledWith(6);
    expect(getStatsProductsCountPastMonths).toHaveBeenCalledWith(6);
    expect(getStatsVisitsCountPastMonths).toHaveBeenCalledWith(6);

    expect(screen.getByText("Painel Administrativo")).toBeInTheDocument();
    expect(screen.getByText("Estatísticas")).toBeInTheDocument();
    expect(screen.getByText("LOGADO COMO:")).toBeInTheDocument();
    expect(screen.getByText("Usuário: Admin")).toBeInTheDocument();
    expect(screen.getByText("Papel: administrador")).toBeInTheDocument();
  });
});
