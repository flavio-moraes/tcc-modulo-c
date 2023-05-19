import { act, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";
import OrderList from "./OrderList";
import { getOrdersFromUser } from "../apiCalls";

jest.mock("../apiCalls");

const mockStore = configureMockStore();

describe("OrderList page", () => {
  let state = {
    user: {
      info: {
        id: 100,
        firstname: "John",
        email: "johndeo@email.com",
      },
      isFetching: false,
      error: null,
      errorCode: 0,
    },
    cart: { quantity: 0 },
  };
  let store = mockStore(() => state);

  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render spinner while fetching orders and render no orders found message", async () => {
    getOrdersFromUser.mockResolvedValue([]);

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <OrderList />
          </Router>
        </Provider>
      );

      expect(screen.getByTestId("spinner")).toBeInTheDocument();
      await waitFor(() => expect(getOrdersFromUser).toHaveBeenCalledTimes(1));
      expect(
        await screen.findByText("Nenhum pedido foi encontrado!")
      ).toBeInTheDocument();
    });
  });

  it("should render order list", async () => {
    const orders = [
      {
        id: 1,
        transactionId: "1234",
        status: "approved",
        amount: 100,
        payment: {
          cardIssuer: "visa",
          cardLastFourDigits: "1235",
          installments: 2,
          installmentsValue: 50,
        },
        products: [
          {
            productName: "Product 1",
            productImage: "image1.jpg",
            variantId: 1,
            variantName: "M",
            variantPrice: 10,
            quantity: 1,
          },
        ],
        address: {
          streetName: "Rua A",
          streetNumber: "123",
          variantId: 1,
          cityName: "Test City",
          stateName: "JS",
          zipCode: "12345-678",
        },
        createdAt: "2022-07-15",
      },
      {
        id: 2,
        transactionId: "5678",
        status: "canceled",
        amount: 200,
        payment: {
          cardIssuer: "master",
          cardLastFourDigits: "7890",
          installments: 2,
          installmentsValue: 100,
        },
        products: [
          {
            productName: "Product 2",
            productImage: "image2.jpg",
            variantId: 2,
            variantName: "G",
            variantPrice: 20,
            quantity: 2,
          },
        ],
        address: {
          streetName: "Rua B",
          streetNumber: "123",
          variantId: 1,
          cityName: "Test City",
          stateName: "JS",
          zipCode: "12345-679",
        },
        createdAt: "2022-07-25",
      },
    ];
    getOrdersFromUser.mockResolvedValue(orders);

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <OrderList />
          </Router>
        </Provider>
      );

      const spinner = screen.getByTestId("spinner");
      expect(spinner).toBeInTheDocument();
      await waitFor(() => expect(getOrdersFromUser).toHaveBeenCalledTimes(1));
      expect(spinner).not.toBeInTheDocument();
      expect(await screen.findByText("Product 1")).toBeInTheDocument();
      expect(await screen.findByText(/Aprovado/)).toBeInTheDocument();
      expect(await screen.findByText(/Visa/)).toBeInTheDocument();
      expect(await screen.findByText(/1235/)).toBeInTheDocument();
      expect(await screen.findByText("12345-678")).toBeInTheDocument();
      expect(await screen.findByText("Product 2")).toBeInTheDocument();
      expect(await screen.findByText(/Cancelado/)).toBeInTheDocument();
      expect(await screen.findByText(/MasterCard/)).toBeInTheDocument();
      expect(await screen.findByText(/7890/)).toBeInTheDocument();
      expect(await screen.findByText("12345-679")).toBeInTheDocument();
    });
  });
});
