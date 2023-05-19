import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import List from "./List";
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

jest.mock("../../apiCalls", () => ({
  getAllUsers: jest.fn(),
  getAllProducts: jest.fn(),
  getAllCategories: jest.fn(),
  getAllOrders: jest.fn(),
  deleteUser: jest.fn(),
  deleteProduct: jest.fn(),
  deleteCategory: jest.fn(),
  deleteOrder: jest.fn(),
  createCategory: jest.fn(),
}));
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/dashboard/Sidebar";

jest.mock("../../components/Navbar");
jest.mock("../../components/dashboard/Sidebar");

const mockStore = configureMockStore();

const mockUserList = [
  {
    id: "5883ed779e67b09e3326b67f",
    firstname: "John",
    lastname: "Doe",
    email: "johndoe@email.com",
    role: "client",
    image: "http://example.com/images/image.jpg",
    favorites: [],
    address: {},
    cart: {},
    createdAt: "2022-11-13T14:05:02.702-04:00",
  },
];

const mockProductList = [
  {
    id: "5883ed779e67b09e3326b67f",
    name: "Camiseta preta",
    description: "Produto 100% algodão.",
    variants: [
      {
        id: "5883ed779e67b09e3326b67f",
        name: "M",
        price: 49.9,
        stock: 545,
      },
    ],
    categories: [
      {
        id: "5883ed779e67b09e3326b67f",
        title: "Camisetas",
      },
    ],
    image: "http://example.com/images/image.jpg",
    createdAt: "2022-11-13T14:05:02.702-04:00",
  },
];

const mockCategoryList = [
  {
    id: "5883ed779e67b09e3326b67f",
    title: "Camisetas",
  },
];

const mockOrderList = [
  {
    id: "5883ed779e67b09e3326b67f",
    userId: "5883ed779e67b09e3326b67f",
    userName: "John Doe",
    transactionId: 1310302448,
    amount: 199.99,
    status: "approved",
    products: [
      {
        productId: "5883ed779e67b09e3326b67f",
        productName: "Camiseta preta",
        productImage: "http://example.com/images/image.jpg",
        variantId: "5883ed779e67b09e3326b67f",
        varinatName: "M",
        variantPrice: 49.9,
        quantity: 37,
      },
    ],
    address: {
      streetName: "Rua A",
      streetNumber: "123",
      cityName: "Cidade A",
      stateName: "JS",
      zipCode: "12345-678",
    },
    payment: {
      approvedDate: "2022-11-13T14:05:02.702-04:00",
      cardIssuer: "master",
      cardLastFourDigits: "6351",
      cardholderName: "John Doe",
      identificationType: "CPF",
      identificationNumber: "12345678909",
      installments: 2,
      installmentValue: 150.14,
    },
    createdAt: "2022-11-13T14:05:02.702-04:00",
  },
];

describe("List component", () => {
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
  state = { ...initialState };
  store = mockStore(() => state);

  beforeEach(() => {
    Navbar.mockImplementation(() => {
      return <div></div>;
    });

    Sidebar.mockImplementation(() => {
      return <div></div>;
    });

    getAllUsers.mockImplementation(() => {
      return Promise.resolve(mockUserList);
    });

    deleteUser.mockImplementation(() => {
      return Promise.resolve("deleted user");
    });

    getAllProducts.mockImplementation(() => {
      return Promise.resolve(mockProductList);
    });

    deleteUser.mockImplementation(() => {
      return Promise.resolve("deleted product");
    });

    getAllOrders.mockImplementation(() => {
      return Promise.resolve(mockOrderList);
    });

    deleteOrder.mockImplementation(() => {
      return Promise.resolve("deleted order");
    });

    getAllCategories.mockImplementation(() => {
      return Promise.resolve(mockCategoryList);
    });

    deleteCategory.mockImplementation(() => {
      return Promise.resolve("deleted category");
    });

    createCategory.mockImplementation(() => {
      return Promise.resolve({
        id: "5883ed779e67b09e3326b67g",
        title: "A new category",
      });
    });
  });

  afterEach(() => {
    component.unmount();
  });

  test("renders user list correctly", async () => {
    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <List type="user" />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getAllUsers).toHaveBeenCalledTimes(1));
      expect(
        screen.getByRole("heading", { name: /Usuários/i })
      ).toBeInTheDocument();
      expect(await screen.findByText(/John Doe/)).toBeInTheDocument();
      expect(await screen.findByText(/johndoe@email\.com/)).toBeInTheDocument();
      expect(await screen.findByText(/Cliente/)).toBeInTheDocument();
    });
  });

  test("user list buttons functions", async () => {
    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <List type="user" />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getAllUsers).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(screen.getByText(/Deletar/i)).toBeInTheDocument()
      );
      fireEvent.click(screen.getByText(/Ver/));
      expect(window.location.href).toMatch(mockUserList[0].id);
      fireEvent.click(screen.getByText(/Editar/));
      expect(window.location.href).toMatch(mockUserList[0].id + "?q=edit");
      fireEvent.click(screen.getByText(/Adicionar/));
      expect(window.location.href).toMatch("novo");
      fireEvent.click(screen.getByText(/Deletar/));
      expect(deleteUser).toHaveBeenCalledWith(mockUserList[0].id);
    });
  });

  test("renders product list correctly", async () => {
    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <List type="product" />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getAllProducts).toHaveBeenCalledTimes(1));
      expect(
        screen.getByRole("heading", { name: /Produtos/i })
      ).toBeInTheDocument();
      expect(await screen.findByText(/Camiseta preta/)).toBeInTheDocument();
      expect(await screen.findByText(/R\$ 49,90/)).toBeInTheDocument();
      expect(await screen.findByText(/545/)).toBeInTheDocument();
    });
  });

  test("product list buttons functions", async () => {
    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <List type="product" />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getAllProducts).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(screen.getByText(/Deletar/i)).toBeInTheDocument()
      );
      fireEvent.click(screen.getByText(/Ver/));
      expect(window.location.href).toMatch(mockProductList[0].id);
      fireEvent.click(screen.getByText(/Editar/));
      expect(window.location.href).toMatch(mockProductList[0].id + "?q=edit");
      fireEvent.click(screen.getByText(/Adicionar/));
      expect(window.location.href).toMatch("novo");
      fireEvent.click(screen.getByText(/Deletar/));
      expect(deleteProduct).toHaveBeenCalledWith(mockProductList[0].id);
    });
  });

  test("renders order list correctly", async () => {
    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <List type="order" />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getAllOrders).toHaveBeenCalledTimes(1));
      expect(
        screen.getByRole("heading", { name: /Pedidos/i })
      ).toBeInTheDocument();
      const date = new Date(mockOrderList[0].createdAt).toLocaleDateString(
        "pt-BR"
      );
      expect(await screen.findByText(date)).toBeInTheDocument();
      expect(
        await screen.findByText(mockOrderList[0].transactionId)
      ).toBeInTheDocument();
      expect(
        await screen.findByText(mockOrderList[0].userName)
      ).toBeInTheDocument();
      expect(await screen.findByText(/R\$ 199,99/)).toBeInTheDocument();
      expect(await screen.findByText("37")).toBeInTheDocument();
      expect(await screen.findByText(/Aprovado/)).toBeInTheDocument();
    });
  });

  test("order list buttons functions", async () => {
    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <List type="order" />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getAllOrders).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(screen.getByText(/Deletar/i)).toBeInTheDocument()
      );
      fireEvent.click(screen.getByText(/Ver/));
      expect(window.location.href).toMatch(mockOrderList[0].id);
      fireEvent.click(screen.getByText(/Editar/));
      expect(window.location.href).toMatch(mockOrderList[0].id + "?q=edit");
      fireEvent.click(screen.getByText(/Deletar/));
      expect(deleteOrder).toHaveBeenCalledWith(mockOrderList[0].id);
    });
  });

  test("renders category list correctly", async () => {
    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <List type="category" />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getAllCategories).toHaveBeenCalledTimes(1));
      expect(
        screen.getByRole("heading", { name: /Categorias de Produto/i })
      ).toBeInTheDocument();
      expect(
        await screen.findByText(mockCategoryList[0].title)
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/Adicionar categoria/)
      ).toBeInTheDocument();
    });
  });

  test("category list buttons functions", async () => {
    await act(async () => {
      component = render(
        <Provider store={store}>
          <Router>
            <List type="category" />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getAllCategories).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(screen.getByText(/Deletar/i)).toBeInTheDocument()
      );
      fireEvent.click(screen.getByText(/Adicionar categoria/));
      expect(
        await screen.findByText(/Título não pode ser vazio!/i)
      ).toBeInTheDocument();
      fireEvent.change(document.getElementById("cat_title"), {
        target: { value: "A new category" },
      });
      fireEvent.click(screen.getByText(/Adicionar categoria/));
      expect(createCategory).toHaveBeenCalledWith({ title: "A new category" });
      expect(await screen.findByText(/A new category/i)).toBeInTheDocument();
      fireEvent.click(screen.getAllByText(/Deletar/)[0]);
      expect(deleteCategory).toHaveBeenCalledWith(mockCategoryList[0].id);
    });
  });

  test("Shows access denied message in the user and order lists for not admin access", () => {
    state = {
      user: {
        info: {
          firstname: "Manager",
          lastname: "Manager",
          email: "manager@example.com",
          image: "user.jpg",
          role: "manager",
        },
      },
    };

    component = render(
      <Provider store={store}>
        <Router>
          <List type="user" />
        </Router>
      </Provider>
    );
    expect(
      screen.getByRole("heading", {
        name: /Você não possui permissão para acessar este painel./i,
      })
    ).toBeInTheDocument();

    component.unmount();
    component = render(
      <Provider store={store}>
        <Router>
          <List type="order" />
        </Router>
      </Provider>
    );
    expect(
      screen.getByRole("heading", {
        name: /Você não possui permissão para acessar este painel./i,
      })
    ).toBeInTheDocument();

    component.unmount();
    component = render(
      <Provider store={store}>
        <Router>
          <List type="product" />
        </Router>
      </Provider>
    );
    expect(
      screen.queryByRole("heading", {
        name: /Você não possui permissão para acessar este painel./i,
      })
    ).not.toBeInTheDocument();
  });
});
