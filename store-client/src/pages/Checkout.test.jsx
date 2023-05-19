import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkout from "./Checkout";
import { Provider, useSelector, useDispatch } from "react-redux";
import { clearCart, saveCartThunk } from "../redux/cartSlice";
import configureMockStore from "redux-mock-store";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../apiCalls";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: jest.fn(),
}));

jest.mock("../redux/cartSlice", () => ({
  ...jest.requireActual("../redux/cartSlice"),
  saveCartThunk: jest.fn(),
}));

jest.mock("../apiCalls", () => ({
  createOrder: jest.fn(),
}));

const mockStore = configureMockStore([]);

describe("Checkout", () => {
  let component;
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
    cart: {
      items: [
        {
          productId: 1,
          productName: "Product 1",
          variantId: 1,
          variantName: "Variant 1",
          variantPrice: 10,
          quantity: 2,
          productImage: "/img/product1.jpg",
        },
        {
          productId: 2,
          productName: "Product 2",
          variantId: 2,
          variantName: "Variant 2",
          variantPrice: 20,
          quantity: 1,
          productImage: "/img/product2.jpg",
        },
      ],
      totalItems: 3,
      totalValue: 40,
    },
  };
  let store = mockStore(() => state);

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Router>
          <Checkout />
        </Router>
      </Provider>
    );
  });

  test("renders checkout form with address input fields", () => {
    expect(screen.getByText("Rua:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome da rua")).toBeInTheDocument();
    expect(screen.getByText("Número:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nº do imóvel")).toBeInTheDocument();
    expect(screen.getByText("Cidade:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome da cidade")).toBeInTheDocument();
    expect(screen.getByText("Estado:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sigla do Estado")).toBeInTheDocument();
    expect(screen.getByText("CEP:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("CEP")).toBeInTheDocument();
  });

  test("updates address state when input fields change and shows error for invalid inputs", async () => {
    const streetNameInput = screen.getByPlaceholderText("Nome da rua");
    fireEvent.change(streetNameInput, { target: { value: "New Street" } });
    expect(streetNameInput.value).toBe("New Street");
    const cityNameInput = screen.getByPlaceholderText("Nome da cidade");
    const nextButton = screen.getByText("Próximo");
    fireEvent.click(nextButton);
    expect(cityNameInput).toHaveClass("invalid");
  });

  test("renders payment form after submitting address", async () => {
    const toastMock = jest.spyOn(toast, "error");

    const streetNameInput = screen.getByPlaceholderText("Nome da rua");
    fireEvent.change(streetNameInput, {
      target: { value: "New Street" },
    });
    expect(streetNameInput.value).toBe("New Street");

    const streetNumberInput = screen.getByPlaceholderText("Nº do imóvel");
    userEvent.type(streetNumberInput, "123");
    expect(streetNumberInput).toHaveValue("123");

    const cityNameInput = screen.getByPlaceholderText("Nome da cidade");
    fireEvent.change(cityNameInput, {
      target: { value: "New City" },
    });
    expect(cityNameInput.value).toBe("New City");

    const stateNameInput = screen.getByPlaceholderText("Sigla do Estado");
    fireEvent.change(stateNameInput, {
      target: { value: "ST" },
    });
    expect(stateNameInput.value).toBe("ST");

    const zipCodeInput = screen.getByPlaceholderText("CEP");
    fireEvent.change(zipCodeInput, {
      target: { value: "123456789" },
    });
    expect(zipCodeInput.value).toBe("123456789");

    const nextButton = screen.getByText("Próximo");
    fireEvent.click(nextButton);

    expect(toastMock).toHaveBeenCalledTimes(0);
    expect(await screen.findByText("2. Dados de Pagamento:")).toBeVisible();
  });

  test("renders address form after clicking on back button", async () => {
    const toastMock = jest.spyOn(toast, "error");
    const mockStore2 = configureMockStore([]);
    let store2 = mockStore2({
      user: {
        info: {
          id: 100,
          firstname: "John",
          email: "johndeo@email.com",
          address: {
            streetName: "New street",
            streetNumber: "123",
            cityName: "New city",
            stateName: "JS",
            zipCode: "123456789",
          },
        },
        isFetching: false,
        error: null,
        errorCode: 0,
      },
      cart: {
        items: [
          {
            productId: 1,
            productName: "Product 1",
            variantId: 1,
            variantName: "Variant 1",
            variantPrice: 10,
            quantity: 2,
            productImage: "/img/product1.jpg",
          },
          {
            productId: 2,
            productName: "Product 2",
            variantId: 2,
            variantName: "Variant 2",
            variantPrice: 20,
            quantity: 1,
            productImage: "/img/product2.jpg",
          },
        ],
        totalItems: 3,
        totalValue: 40,
      },
    });

    component.unmount();
    component = render(
      <Provider store={store2}>
        <Router>
          <Checkout />
        </Router>
      </Provider>
    );

    expect(screen.getByPlaceholderText("Nome da rua")).toHaveValue(
      "New street"
    );
    expect(screen.getByPlaceholderText("Nº do imóvel")).toHaveValue("123");
    expect(screen.getByPlaceholderText("Nome da cidade")).toHaveValue(
      "New city"
    );
    expect(screen.getByPlaceholderText("Sigla do Estado")).toHaveValue("JS");
    expect(screen.getByPlaceholderText("CEP")).toHaveValue("123456789");

    expect(screen.getByText("2. Dados de Pagamento:")).not.toBeVisible();
    const nextButton = screen.getByText("Próximo");
    fireEvent.click(nextButton);
    expect(toastMock).toHaveBeenCalledTimes(0);
    expect(screen.getByText("2. Dados de Pagamento:")).toBeVisible();
    const backButton = screen.getByText("VOLTAR");
    fireEvent.click(backButton);
    expect(screen.getByText("1. Endereço de Entrega:")).toBeVisible();
    expect(screen.getByText("2. Dados de Pagamento:")).not.toBeVisible();
  });

  test("go back to cart page if cart is empty", () => {
    Navigate.mockImplementation(() => {
      return <div>carrinho</div>;
    });

    let store2 = mockStore({
      user: {
        info: {
          id: 100,
          firstname: "John",
          email: "johndeo@email.com",
          address: {
            streetName: "New street",
            streetNumber: "123",
            cityName: "New city",
            stateName: "JS",
            zipCode: "123456789",
          },
        },
        isFetching: false,
        error: null,
        errorCode: 0,
      },
      cart: {
        items: [],
        totalItems: 0,
        totalValue: 0,
      },
    });

    component.unmount();
    component = render(
      <Provider store={store2}>
        <Router>
          <Checkout />
        </Router>
      </Provider>
    );

    expect(component.container.innerHTML).toBe("<div>carrinho</div>");
  });
});
